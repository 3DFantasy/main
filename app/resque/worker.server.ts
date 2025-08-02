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

async function cleanupStaleWorkers(queueName: string) {
	try {
		const redis = new Redis(connectionDetails.host)
		let staleKeys = 0
		// Find and remove stale worker entries for this queue
		const workerKeys = await redis.keys(`resque:worker:*:${queueName}*`)

		if (workerKeys.length > 0) {
			staleKeys += workerKeys.length

			// Remove each stale worker entry
			for (const key of workerKeys) {
				await redis.del(key)
			}

			// Also clean up any stats for these workers
			const statKeys = await redis.keys(`resque:stat:*:${queueName}*`)
			for (const key of statKeys) {
				await redis.del(key)
			}
		}

		// Clean up entries in the resque:workers SET
		const workers = await redis.smembers('resque:workers')
		const staleWorkers = workers.filter((worker) => worker.includes(`:${queueName}`))

		if (staleWorkers.length > 0) {
			staleKeys += staleWorkers.length

			await redis.srem('resque:workers', ...staleWorkers)
		}

		logger.info(`Worker cleanup complete for ${queueName} queue, stale keys:${staleKeys}`)

		// Close the Redis connection
		await redis.quit()
	} catch (error) {
		console.error(`Error cleaning up stale workers for ${queueName}:`, error)
	}
}

export const initWorker = async ({ schedule, team }: InitWorkerProps) => {
	const activeWorkers: Worker[] = []

	const queues: InitWorkerProps = {
		schedule,
		team,
	}

	for (const [jobType, isEnabled] of Object.entries(queues)) {
		if (isEnabled) {
			const queueTitle = queueTitles[jobType as keyof typeof queueTitles]?.queue

			if (!queueTitle) {
				console.error(`Invalid job type: ${jobType}`)
				continue
			}

			await cleanupStaleWorkers(queueTitle)

			// Check if a worker for this queue already exists
			if (globalWorkerRegistry[queueTitle]) {
				logger.info(`Worker for ${queueTitle} already exists, skipping initialization`)
				activeWorkers.push(globalWorkerRegistry[queueTitle])
				continue
			}

			const worker = new Worker(
				{
					connection: connectionDetails,
					queues: [queueTitle],
				},
				jobs
			)

			worker.on('start', () => {
				logger.info(`Worker started for ${queueTitle}`)
			})

			worker.on('end', () => {
				logger.info(`Worker ended for ${queueTitle}`)
				const index = activeWorkers.indexOf(worker)
				if (index !== -1) {
					activeWorkers.splice(index, 1)
				}
				if (globalWorkerRegistry[queueTitle] === worker) {
					delete globalWorkerRegistry[queueTitle]
				}
			})

			worker.on('success', (queue, job, result, duration) => {
				logger.info(`Job success ${queue} ${JSON.stringify(job)} >> ${result} (${duration}ms)`)
			})

			worker.on('failure', (queue, job, failure, duration) => {
				logger.info(`Job failure ${queue} ${JSON.stringify(job)} >> ${failure} (${duration}ms)`)
			})

			worker.on('error', (error, queue, job) => {
				logger.info(`Error ${queue} ${JSON.stringify(job)} >> ${error}`)
			})

			await worker.connect()
			await worker.start()

			activeWorkers.push(worker)
			globalWorkerRegistry[queueTitle] = worker
		}
	}

	if (!process.listenerCount('SIGTERM') && !process.listenerCount('SIGINT')) {
		process.on('SIGTERM', shutdown)
		process.on('SIGINT', shutdown)
	}

	return activeWorkers
}

async function shutdown() {
	logger.info(`Shutting down ${Object.keys(globalWorkerRegistry).length} workers...`)

	try {
		await Promise.all(Object.values(globalWorkerRegistry).map((worker) => worker.end()))
		Object.keys(globalWorkerRegistry).forEach((key) => delete globalWorkerRegistry[key])
		process.exit(0)
	} catch (error) {
		console.error('Error shutting down workers:', error)
		process.exit(1)
	}
}
