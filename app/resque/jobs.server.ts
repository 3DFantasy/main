import { Plugins } from 'node-resque'
import { saveAllDepthCharts, teamCheck } from '~/resque/jobs'
import { fetchAPIPXP } from '~/utils/fetch/apiPXP.server'

import type { SaveAllDepthChartsJobProps, TeamCheckJobProps } from './main.server'

export const jobs: any = {
	fetchAllPXP: {
		plugins: [Plugins.JobLock],
		pluginOptions: {
			JobLock: { reEnqueue: true },
		},
		perform: async (gameIDs: string[], year: number) => {
			return await fetchAPIPXP({ gameIDs, year })
		},
	},
	teamCheck: {
		plugins: [Plugins.JobLock],
		pluginOptions: {
			JobLock: { reEnqueue: true },
		},
		perform: async (teamCheckProps: TeamCheckJobProps) => {
			return await teamCheck({
				teamId: teamCheckProps.teamId,
			})
		},
	},
	saveAllDepthCharts: {
		plugins: [Plugins.JobLock],
		pluginOptions: {
			JobLock: { reEnqueue: true },
		},
		perform: async (saveAllDepthChartsProps: SaveAllDepthChartsJobProps) => {
			return await saveAllDepthCharts({
				teamId: saveAllDepthChartsProps.teamId,
			})
		},
	},
}
