import Redis from 'ioredis'
import { Worker } from 'node-resque'
import { jobs } from '~/resque/jobs.server'
import { connectionDetails } from '~/resque/main.server'
import { logger } from '~/utils/logger'

export type InitWorkerProps = {
    schedule: boolean
    team: boolean
}

export const queueTitles = {
    schedule: {
        queue: `${process.env.REDIS_QUEUE}-schedule`,
    },
    team: {
        queue: `${process.env.REDIS_QUEUE}-team`,
    },
}

const globalWorkerRegistry: Record<string, Worker> = {}
const WORKER_TIMEOUT = 30000 // 30 seconds

async function cleanupStaleWorkers(queueName: string) {
    try {
        const redis = new Redis(connectionDetails.host)

        // Only clean up workers that have been inactive for more than WORKER_TIMEOUT
        const cutoffTime = Date.now() - WORKER_TIMEOUT

        // Get all workers and check their last activity
        const workers = await redis.smembers('resque:workers')
        const staleWorkers = []

        for (const workerName of workers) {
            if (workerName.includes(`:${queueName}`)) {
                const workerKey = `resque:worker:${workerName}`
                const lastSeen = await redis.get(`${workerKey}:started`)

                if (!lastSeen || parseInt(lastSeen) < cutoffTime) {
                    staleWorkers.push(workerName)
                    await redis.del(workerKey)
                    await redis.del(`${workerKey}:started`)
                }
            }
        }

        if (staleWorkers.length > 0) {
            await redis.srem('resque:workers', ...staleWorkers)
            logger.info(
                `Cleaned up ${staleWorkers.length} stale workers for ${queueName}`
            )
        }

        await redis.quit()
    } catch (error) {
        logger.error(
            `Error cleaning up stale workers for ${queueName}: ${error}`
        )
    }
}

export const initWorker = async ({ schedule, team }: InitWorkerProps) => {
    const activeWorkers: Worker[] = []

    const queues: InitWorkerProps = { schedule, team }

    for (const [jobType, isEnabled] of Object.entries(queues)) {
        if (isEnabled) {
            const queueTitle =
                queueTitles[jobType as keyof typeof queueTitles]?.queue

            if (!queueTitle) {
                logger.error(`Invalid job type: ${jobType}`)
                continue
            }

            // Check if worker already exists
            if (globalWorkerRegistry[queueTitle]) {
                logger.info(`Worker for ${queueTitle} already exists`)
                activeWorkers.push(globalWorkerRegistry[queueTitle])
                continue
            }

            // Clean up stale workers before starting new one
            await cleanupStaleWorkers(queueTitle)

            const worker = new Worker(
                {
                    connection: connectionDetails,
                    queues: [queueTitle],
                    timeout: WORKER_TIMEOUT,
                    looping: true,
                    name: `${process.env.NODE_ENV}-${jobType}-${
                        process.pid
                    }-${Date.now()}`,
                },
                jobs
            )

            // Enhanced error handling
            worker.on('start', () => {
                logger.info(`Worker started for ${queueTitle}`)
            })

            worker.on('end', async () => {
                logger.info(`Worker ended for ${queueTitle}`)

                // Clean up registry
                if (globalWorkerRegistry[queueTitle] === worker) {
                    delete globalWorkerRegistry[queueTitle]
                }

                const index = activeWorkers.indexOf(worker)
                if (index !== -1) {
                    activeWorkers.splice(index, 1)
                }
            })

            worker.on('success', (queue, job, result, duration) => {
                logger.info(
                    `Job success ${queue} ${job.class} >> completed (${duration}ms)`
                )
            })

            worker.on('failure', (queue, job, failure, duration) => {
                logger.error(
                    `Job failure ${queue} ${job.class} >> ${failure} (${duration}ms)`
                )
            })

            worker.on('error', (error, queue, job) => {
                logger.error(
                    `Worker error ${queue} ${
                        job?.class || 'unknown'
                    } >> ${error}`
                )
            })

            // Add polling event to track worker activity
            worker.on('poll', (queue) => {
                logger.debug(`Worker polling ${queue}`)
            })

            try {
                await worker.connect()
                await worker.start()

                activeWorkers.push(worker)
                globalWorkerRegistry[queueTitle] = worker

                logger.info(`Worker successfully initialized for ${queueTitle}`)
            } catch (error) {
                logger.error(
                    `Failed to start worker for ${queueTitle}: ${error}`
                )
            }
        }
    }

    // Set up graceful shutdown
    if (!process.listenerCount('SIGTERM')) {
        process.on('SIGTERM', shutdown)
    }
    if (!process.listenerCount('SIGINT')) {
        process.on('SIGINT', shutdown)
    }

    return activeWorkers
}

async function shutdown() {
    logger.info(
        `Gracefully shutting down ${
            Object.keys(globalWorkerRegistry).length
        } workers...`
    )

    try {
        // Give workers time to finish current jobs
        await Promise.all(
            Object.values(globalWorkerRegistry).map(async (worker) => {
                try {
                    await worker.end()
                } catch (error) {
                    logger.error(`Error ending worker: ${error}`)
                }
            })
        )

        // Clear registry
        Object.keys(globalWorkerRegistry).forEach(
            (key) => delete globalWorkerRegistry[key]
        )

        logger.info('All workers shut down successfully')
        process.exit(0)
    } catch (error) {
        logger.error(`Error during shutdown: ${error}`)
        process.exit(1)
    }
}
