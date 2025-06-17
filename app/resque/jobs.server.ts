import { Plugins } from 'node-resque'
import { TeamCheck } from '~/resque/jobs'
import { fetchAPIPXP } from '~/utils/fetch/apiPXP.server'
import {
	team1,
	team2,
	team3,
	team4,
	team5,
	team6,
	team7,
	team8,
	team9,
} from '~/utils/puppeteer/index.server'

import type { TeamCheckJobProps } from './main.server'

const teamFuncMap = {
	team1: team1,
	team2: team2,
	team3: team3,
	team4: team4,
	team5: team5,
	team6: team6,
	team7: team7,
	team8: team8,
	team9: team9,

	// Add other teams as needed
}

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
			return await TeamCheck({
				teamId: teamCheckProps.teamId,
				teamCheckFunc: teamFuncMap[teamCheckProps.teamCheckFuncName as keyof typeof teamFuncMap],
			})
		},
	},
}
