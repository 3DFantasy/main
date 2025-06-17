import { Plugins } from 'node-resque'
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
} from '~/resque/jobs'
import { fetchAPIPXP } from '~/utils/fetch/apiPXP.server'

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
