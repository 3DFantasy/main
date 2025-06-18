import { Worker } from 'node-resque'
import { jobs } from '~/resque/jobs.server'
import { connectionDetails } from '~/resque/main.server'

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

			// Check if a worker for this queue already exists
			if (globalWorkerRegistry[queueTitle]) {
				console.log(`Worker for ${queueTitle} already exists, skipping initialization`)
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
				console.log(`Worker started for ${queueTitle}`)
			})

			worker.on('end', () => {
				console.log(`Worker ended for ${queueTitle}`)
				const index = activeWorkers.indexOf(worker)
				if (index !== -1) {
					activeWorkers.splice(index, 1)
				}
				if (globalWorkerRegistry[queueTitle] === worker) {
					delete globalWorkerRegistry[queueTitle]
				}
			})

			worker.on('success', (queue, job, result, duration) => {
				console.log(`Job success ${queue} ${JSON.stringify(job)} >> ${result} (${duration}ms)`)
			})

			worker.on('failure', (queue, job, failure, duration) => {
				console.log(`Job failure ${queue} ${JSON.stringify(job)} >> ${failure} (${duration}ms)`)
			})

			worker.on('error', (error, queue, job) => {
				console.log(`Error ${queue} ${JSON.stringify(job)} >> ${error}`)
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
	console.log(`Shutting down ${Object.keys(globalWorkerRegistry).length} workers...`)

	try {
		await Promise.all(Object.values(globalWorkerRegistry).map((worker) => worker.end()))
		Object.keys(globalWorkerRegistry).forEach((key) => delete globalWorkerRegistry[key])
		process.exit(0)
	} catch (error) {
		console.error('Error shutting down workers:', error)
		process.exit(1)
	}
}
