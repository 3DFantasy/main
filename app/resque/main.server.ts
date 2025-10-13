import { Queue } from 'node-resque'
import { jobs } from '~/resque/jobs.server'
import { queueTitles } from '~/resque/worker.server'
import { logger } from '~/utils/logger'

import type { TeamId } from '~/types'

export type TeamCheckJobProps = {
    teamId: TeamId
}
export type SaveAllDepthChartsJobProps = {
    teamId: TeamId
}

export type ResqueTaskInput = {
    job: 'teamCheck' | 'saveAllDepthCharts'
    teamCheckProps?: TeamCheckJobProps
    saveAllDepthChartsProps?: SaveAllDepthChartsJobProps
}

export const connectionDetails = {
    pkg: 'ioredis',
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME,
    database: 0,
}

const fileName = 'resque/main.server.ts'

export async function resqueTask({
    job,
    teamCheckProps,
    saveAllDepthChartsProps,
}: ResqueTaskInput) {
    const jobDetails = {
        teamCheck: {
            queue: queueTitles['team'].queue,
            props: teamCheckProps,
        },
        saveAllDepthCharts: {
            queue: queueTitles['team'].queue,
            props: saveAllDepthChartsProps,
        },
    }
    const props = jobDetails[job].props
    const queueTitle = jobDetails[job].queue

    if (!queueTitle || !props) {
        throw new Error('Invalid job type')
    }

    const redisQueue = new Queue({ connection: connectionDetails }, jobs)

    // Add queue event listeners for debugging
    redisQueue.on('error', function (error) {
        logger.error(fileName, `resque:queue error: ${error}`)
    })
    try {
        await redisQueue.connect()

        // Log the enqueue attempt
        logger.info(fileName, `Enqueueing job: ${job} to queue: ${queueTitle}`)

        await redisQueue.enqueue(queueTitle, job, [props])

        logger.info(fileName, `Successfully enqueued job: ${job}`)
    } catch (error) {
        logger.error(fileName, `Failed to enqueue job ${job}: ${error}`)
        throw error
    } finally {
        await redisQueue.end()
    }
}

// Helper function to check queue status
export async function getQueueStatus(queueName: string) {
    const redisQueue = new Queue({ connection: connectionDetails }, jobs)

    try {
        await redisQueue.connect()

        const queueLength = await redisQueue.length(queueName)

        logger.info(fileName, `Queue ${queueName} - Pending: ${queueLength}`)

        return { pending: queueLength }
    } finally {
        await redisQueue.end()
    }
}
