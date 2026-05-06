import { saveAllDepthCharts, teamCheck } from '~/resque/jobs'
import { fetchAPIPXP } from '~/utils/fetch/apiPXP.server'

import type {
    SaveAllDepthChartsJobProps,
    TeamCheckJobProps,
} from './main.server'

export const jobs: any = {
    fetchAllPXP: {
        perform: async (gameIDs: string[], year: number) => {
            return await fetchAPIPXP({ gameIDs, year })
        },
    },
    teamCheck: {
        perform: async (teamCheckProps: TeamCheckJobProps) => {
            return await teamCheck({
                teamId: teamCheckProps.teamId,
            })
        },
    },
    saveAllDepthCharts: {
        perform: async (
            saveAllDepthChartsProps: SaveAllDepthChartsJobProps
        ) => {
            return await saveAllDepthCharts({
                teamId: saveAllDepthChartsProps.teamId,
            })
        },
    },
}
