import { Scheduler, Queue, Worker, Plugins } from 'node-resque'
import { fetchAPIPXP } from './fetch/apiPXP.server'
import {
	Team1Check,
	Team2Check,
	Team3Check,
	Team4Check,
	Team5Check,
	Team6Check,
	Team7Check,
	Team8Check,
	Team9Check,
} from './puppeteer'
// import * as schedule from 'node-schedule'
// import { createSignature } from './createSignature'

export async function nodeResque() {
	// ////////////////////////
	// SET UP THE CONNECTION //
	// ////////////////////////

	const connectionDetails = {
		pkg: 'ioredis',
		host: process.env.REDIS_HOST,
		password: process.env.REDIS_PASSWORD,
		port: Number(process.env.REDIS_PORT),
		username: process.env.REDIS_USERNAME,
		database: 0,
	}

	// ////////////////////////
	// JOBS                  //
	// ////////////////////////

	// let jobsToComplete = 0

	const jobs: any = {
		fetchAllPXP: {
			plugins: [Plugins.JobLock],
			pluginOptions: {
				JobLock: { reEnqueue: true },
			},
			perform: async (gameIDs: string[], year: number) => {
				return await fetchAPIPXP({ gameIDs, year })
			},
		},
		Team1Check: {
			plugins: [Plugins.JobLock],
			pluginOptions: {
				JobLock: { reEnqueue: true },
			},
			perform: async () => {
				return await Team1Check()
			},
		},
		Team2Check: {
			plugins: [Plugins.JobLock],
			pluginOptions: {
				JobLock: { reEnqueue: true },
			},
			perform: async () => {
				return await Team2Check()
			},
		},
		Team3Check: {
			plugins: [Plugins.JobLock],
			pluginOptions: {
				JobLock: { reEnqueue: true },
			},
			perform: async () => {
				return await Team3Check()
			},
		},
		Team4Check: {
			plugins: [Plugins.JobLock],
			pluginOptions: {
				JobLock: { reEnqueue: true },
			},
			perform: async () => {
				return await Team4Check()
			},
		},
		Team5Check: {
			plugins: [Plugins.JobLock],
			pluginOptions: {
				JobLock: { reEnqueue: true },
			},
			perform: async () => {
				return await Team5Check()
			},
		},
		Team6Check: {
			plugins: [Plugins.JobLock],
			pluginOptions: {
				JobLock: { reEnqueue: true },
			},
			perform: async () => {
				return await Team6Check()
			},
		},
		Team7Check: {
			plugins: [Plugins.JobLock],
			pluginOptions: {
				JobLock: { reEnqueue: true },
			},
			perform: async () => {
				return await Team7Check()
			},
		},
		Team8Check: {
			plugins: [Plugins.JobLock],
			pluginOptions: {
				JobLock: { reEnqueue: true },
			},
			perform: async () => {
				return await Team8Check()
			},
		},
		Team9Check: {
			plugins: [Plugins.JobLock],
			pluginOptions: {
				JobLock: { reEnqueue: true },
			},
			perform: async () => {
				return await Team9Check()
			},
		},
	}

	// /////////////////
	// START A WORKER //
	// /////////////////

	const worker = new Worker({ connection: connectionDetails, queues: [process.env.REDIS_QUEUE] }, jobs)
	await worker.connect()
	worker.start()

	// ////////////////////////
	// SCHEDULER             //
	// ////////////////////////

	// const scheduler = new Scheduler({ connection: connectionDetails })
	// await scheduler.connect()
	// scheduler.start()

	worker.on('start', () => {
		console.log('worker started')
	})
	worker.on('end', () => {
		console.log('worker ended')
	})
	worker.on('cleaning_worker', (worker, pid) => {
		console.log(`cleaning old worker ${worker}`)
	})
	worker.on('poll', (queue) => {
		console.log(`worker polling ${queue}`)
	})
	worker.on('job', (queue, job) => {
		console.log(`working job ${queue} ${JSON.stringify(job)}`)
	})
	worker.on('reEnqueue', (queue, job, plugin) => {
		console.log(`reEnqueue job (${plugin}) ${queue} ${JSON.stringify(job)}`)
	})
	worker.on('success', (queue, job, result) => {
		console.log(`job success ${queue} ${JSON.stringify(job)} >> ${result}`)
	})
	worker.on('failure', (queue, job, failure) => {
		console.log(`job failure ${queue} ${JSON.stringify(job)} >> ${failure}`)
	})
	worker.on('error', (error, queue, job) => {
		console.log(`error ${queue} ${JSON.stringify(job)}  >> ${error}`)
	})
	worker.on('pause', () => {
		console.log('worker paused')
	})

	// scheduler.on('start', () => {
	// 	console.log('scheduler started')
	// })
	// scheduler.on('end', () => {
	// 	console.log('scheduler ended')
	// })
	// scheduler.on('poll', () => {
	// 	console.log('scheduler polling')
	// })
	// scheduler.on('leader', () => {
	// 	console.log('scheduler became leader')
	// })
	// scheduler.on('error', (error) => {
	// 	console.log(`scheduler error >> ${error}`)
	// })
	// scheduler.on('cleanStuckWorker', (workerName, errorPayload, delta) => {
	// 	console.log(`failing ${workerName} (stuck for ${delta}s) and failing job ${errorPayload}`)
	// })
	// scheduler.on('workingTimestamp', (timestamp) => {
	// 	console.log(`scheduler working timestamp ${timestamp}`)
	// })
	// scheduler.on('transferredJob', (timestamp, job) => {
	// 	console.log(`scheduler enquing job ${timestamp} >> ${JSON.stringify(job)}`)
	// })

	// //////////////
	// DEFINE JOBS //
	// //////////////

	const queue = new Queue({ connection: connectionDetails }, jobs)

	queue.on('error', function (error) {
		console.log(error)
	})
	await queue.connect()

	// const midnight = new schedule.RecurrenceRule()
	// midnight.hour = 0
	// midnight.minute = 1
	// midnight.tz = 'Canada/Eastern'

	// const test = new schedule.RecurrenceRule()
	// test.hour = 23
	// test.minute = 33
	// test.tz = 'Canada/Eastern'

	// schedule.scheduleJob(test, async () => {
	// 	console.log('>>> enquing a job')
	// 	await queue.enqueue(process.env.REDIS_QUEUE, 'fetchAllPXP', [gameIDs])
	// })

	// ////////////////////
	// SHUTDOWN HELPERS //
	// ////////////////////

	const shutdown = async () => {
		// await scheduler.end()
		await worker.end()
		console.log('bye.')
		process.exit()
	}

	process.on('SIGTERM', shutdown)
	process.on('SIGINT', shutdown)
}
