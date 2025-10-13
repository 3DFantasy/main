import { Plugins } from 'node-resque'
import { saveAllDepthCharts, teamCheck } from '~/resque/jobs'
import { fetchAPIPXP } from '~/utils/fetch/apiPXP.server'
import { logger } from '~/utils/logger'

import type {
    SaveAllDepthChartsJobProps,
    TeamCheckJobProps,
} from './main.server'

const fileName = 'resque/jobs.server.ts'

export const jobs: any = {
    fetchAllPXP: {
        plugins: [Plugins.JobLock],
        pluginOptions: {
            JobLock: {
                reEnqueue: false,
                key: (queue: string, func: string, args: any[]) => {
                    return `lock:${queue}:${func}:${JSON.stringify(args)}`
                },
            },
        },
        perform: async (...args: any[]) => {
            logger.info(fileName, `fetchAllPXP args: ${args}`)
            const [gameIDs, year] = args
            return await fetchAPIPXP({ gameIDs, year })
        },
    },
    teamCheck: {
        plugins: [Plugins.JobLock],
        pluginOptions: {
            JobLock: {
                reEnqueue: false,
                key: (queue: string, func: string, args: any[]) => {
                    const teamId = args[0]?.teamId
                    return `lock:${queue}:${func}:team:${teamId}`
                },
            },
        },
        perform: async (...args: any[]) => {
            logger.info(fileName, `teamCheck received args: ${args}`)

            // Handle the case where args might be nested
            let teamCheckProps: TeamCheckJobProps

            if (args.length === 1 && args[0]) {
                // If it's passed as a single object
                teamCheckProps = args[0] as TeamCheckJobProps
            } else {
                // If it's passed as separate arguments (shouldn't happen but just in case)
                teamCheckProps = { teamId: args[0] }
            }

            logger.info(
                fileName,
                `Processing teamCheck for team ${teamCheckProps.teamId}`
            )

            const result = await teamCheck({
                teamId: teamCheckProps.teamId,
            })

            logger.info(
                fileName,
                `Completed teamCheck job for team ${teamCheckProps.teamId}`
            )
            return result
        },
    },
    saveAllDepthCharts: {
        plugins: [Plugins.JobLock],
        pluginOptions: {
            JobLock: {
                reEnqueue: false,
                key: (queue: string, func: string, args: any[]) => {
                    const teamId = args[0]?.teamId
                    return `lock:${queue}:${func}:team:${teamId}`
                },
            },
        },
        perform: async (...args: any[]) => {
            logger.info(fileName, `saveAllDepthCharts received args: ${args}`)

            let saveAllDepthChartsProps: SaveAllDepthChartsJobProps

            if (args.length === 1 && args[0]) {
                saveAllDepthChartsProps = args[0] as SaveAllDepthChartsJobProps
            } else {
                saveAllDepthChartsProps = { teamId: args[0] }
            }

            logger.info(
                fileName,
                `Processing saveAllDepthCharts for team ${saveAllDepthChartsProps.teamId}`
            )

            const result = await saveAllDepthCharts({
                teamId: saveAllDepthChartsProps.teamId,
            })

            logger.info(
                fileName,
                `Completed saveAllDepthCharts job for team ${saveAllDepthChartsProps.teamId}`
            )
            return result
        },
    },
}
