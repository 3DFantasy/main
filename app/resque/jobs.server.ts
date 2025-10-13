import { Plugins } from 'node-resque'
import { saveAllDepthCharts, teamCheck } from '~/resque/jobs'
import { fetchAPIPXP } from '~/utils/fetch/apiPXP.server'
import { logger } from '~/utils/logger'

import type {
    SaveAllDepthChartsJobProps,
    TeamCheckJobProps,
} from './main.server'

export const jobs: any = {
    fetchAllPXP: {
        plugins: [Plugins.JobLock],
        pluginOptions: {
            JobLock: {
                reEnqueue: false, // Don't re-enqueue locked jobs
                key: (queue: string, func: string, args: any[]) => {
                    return `lock:${queue}:${func}:${JSON.stringify(args)}`
                },
            },
        },
        perform: async (gameIDs: string[], year: number) => {
            logger.info(
                `Starting fetchAllPXP job for ${gameIDs.length} games, year ${year}`
            )
            const result = await fetchAPIPXP({ gameIDs, year })
            logger.info(`Completed fetchAllPXP job`)
            return result
        },
    },
    teamCheck: {
        plugins: [Plugins.JobLock],
        pluginOptions: {
            JobLock: {
                reEnqueue: false, // This was the problem!
                key: (queue: string, func: string, args: any[]) => {
                    // Create unique lock per team
                    const teamId = args[0]?.teamId
                    return `lock:${queue}:${func}:team:${teamId}`
                },
            },
        },
        perform: async (teamCheckProps: TeamCheckJobProps) => {
            logger.info(
                `Starting teamCheck job for team ${teamCheckProps.teamId}`
            )
            const result = await teamCheck({
                teamId: teamCheckProps.teamId,
            })
            logger.info(
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
        perform: async (
            saveAllDepthChartsProps: SaveAllDepthChartsJobProps
        ) => {
            logger.info(
                `Starting saveAllDepthCharts job for team ${saveAllDepthChartsProps.teamId}`
            )
            const result = await saveAllDepthCharts({
                teamId: saveAllDepthChartsProps.teamId,
            })
            logger.info(
                `Completed saveAllDepthCharts job for team ${saveAllDepthChartsProps.teamId}`
            )
            return result
        },
    },
}
