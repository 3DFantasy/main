import { Queue, Scheduler } from 'node-resque'
import * as schedule from 'node-schedule'
import { jobs } from '~/resque/jobs.server'
import { connectionDetails } from '~/resque/main.server'
import { queueTitles } from '~/resque/worker.server'

export async function nodeScheduler() {
	// ////////////////////////
	//        SCHEDULER      //
	// ////////////////////////

	const scheduler = new Scheduler({ connection: connectionDetails })
	await scheduler.connect()
	scheduler.start()

	scheduler.on('start', () => {
		console.log('scheduler started')
	})
	scheduler.on('end', () => {
		console.log('scheduler ended')
	})
	scheduler.on('poll', () => {
		console.log('scheduler polling')
	})
	scheduler.on('leader', () => {
		console.log('scheduler became leader')
	})
	scheduler.on('error', (error) => {
		console.log(`scheduler error >> ${error}`)
	})
	scheduler.on('cleanStuckWorker', (workerName, errorPayload, delta) => {
		console.log(`failing ${workerName} (stuck for ${delta}s) and failing job ${errorPayload}`)
	})
	scheduler.on('workingTimestamp', (timestamp) => {
		console.log(`scheduler working timestamp ${timestamp}`)
	})
	scheduler.on('transferredJob', (timestamp, job) => {
		console.log(`scheduler enquing job ${timestamp} >> ${JSON.stringify(job)}`)
	})

	// //////////////
	// DEFINE JOBS //
	// //////////////

	const queue = new Queue({ connection: connectionDetails }, jobs)
	queue.on('error', function (error) {
		console.log(error)
	})
	await queue.connect()

	// const tenAfterMidnight = new schedule.RecurrenceRule()
	// tenAfterMidnight.hour = 0
	// tenAfterMidnight.minute = 10
	// tenAfterMidnight.tz = 'Etc/UTC'

	// const firstOfTheMonth = new schedule.RecurrenceRule()
	// firstOfTheMonth.hour = 0
	// firstOfTheMonth.minute = 1
	// firstOfTheMonth.date = 1
	// firstOfTheMonth.tz = 'Etc/UTC'

	// const everyHour = new schedule.RecurrenceRule()
	// everyHour.minute = 1
	// everyHour.tz = 'Etc/UTC'

	const everySunday = new schedule.RecurrenceRule()
	everySunday.dayOfWeek = 0 // This will run every Sunday
	everySunday.hour = 20 // At 8pm (20:00)
	everySunday.minute = 0 // At 10 minutes past midnight
	everySunday.tz = 'Etc/UTC' // In UTC timezone

	// const test = new schedule.RecurrenceRule()
	// test.hour = 22
	// test.minute = 14
	// test.tz = 'Canada/Eastern'
	// console.log(Object.keys(schedule.scheduledJobs)[0])
	// console.log(schedule.scheduledJobs[Object.keys(schedule.scheduledJobs)[0]].nextInvocation())

	schedule.scheduleJob(everySunday, async () => {
		if (scheduler.leader) {
			console.log('>>> enquing {} job')
			await queue.enqueue(queueTitles.scheduler.queue, '{}', [])
		}
	})

	const shutdown = async () => {
		await scheduler.end()
		console.log('scheduler shutdown ..')
		process.exit()
	}

	process.on('SIGTERM', shutdown)
	process.on('SIGINT', shutdown)
}
