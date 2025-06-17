import { Queue } from 'node-resque'
import { jobs } from '~/resque/jobs.server'
import { queueTitles } from '~/resque/worker.server'

export type TeamCheckJobProps = {
	teamId: number
	teamCheckFuncName: string
}

export type ResqueTaskInput = {
	job: 'teamCheck'
	teamCheckProps?: TeamCheckJobProps
}

// ///////////////////////////
//      CONNECTION INFO     //
// ///////////////////////////

export const connectionDetails = {
	pkg: 'ioredis',
	host: process.env.REDIS_HOST,
	password: process.env.REDIS_PASSWORD,
	port: Number(process.env.REDIS_PORT),
	username: process.env.REDIS_USERNAME,
	database: 0,
}

export async function resqueTask({ job, teamCheckProps }: ResqueTaskInput) {
	const jobDetails = {
		teamCheck: {
			queue: queueTitles['teamCheck'].queue,
			props: teamCheckProps,
		},
	}
	const props = jobDetails[job].props

	const queueTitle = jobDetails[job].queue
	if (!queueTitle || !props) {
		throw new Error('Invalid job type')
	}

	const redisQueue = new Queue({ connection: connectionDetails }, jobs)

	redisQueue.on('error', function (error) {
		console.log(error)
	})

	await redisQueue.connect()

	await redisQueue.enqueue(queueTitle, job, [props])

	await redisQueue.end()
}
