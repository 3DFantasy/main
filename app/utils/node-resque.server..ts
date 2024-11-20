import { Scheduler, Queue, Worker, Plugins } from 'node-resque'
// import * as schedule from 'node-schedule'
// import { createSignature } from './createSignature'
import { PXPAPIResponse } from '~/types'
import { gameCreate } from '~/dao'
import { gameIDs } from '~/data/gameIDs'
import { timeout } from './timeout'

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
			perform: async (gameIDs: string[]) => {
				const url = process.env.PXP_API_URL
				gameIDs.map(async (gameID) => {
					const resp = await fetch(url + gameID, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					}).then(async (result) => {
						const resp = (await result.json()) as PXPAPIResponse

						const game = await gameCreate({
							data: {
								id: gameID,
								response: JSON.stringify(resp),
							},
						})
						await timeout(5)
						if (!game) {
							console.log(`Something went wrong creating: ${gameID}`)
						} else {
							console.log(`${gameID} ✔`)
						}
					})
				})
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
	await queue.enqueue(process.env.REDIS_QUEUE, 'fetchAllPXP', [gameIDs])

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
	// 	await queue.enqueue(process.env.REDIS_QUEUE, 'test')
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
