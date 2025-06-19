import { db } from '~/lib/db.server'
import { teamHandlers } from '~/utils/puppeteer/index.server'

import type { DepthChartObject } from '~/types'

export async function saveAllDepthCharts({ teamId }: { teamId: number }): Promise<boolean> {
	const year = Number(process.env.LEAGUE_YEAR)
	let result: DepthChartObject[] | null = null
	if (teamHandlers[teamId as keyof typeof teamHandlers]) {
		result = await teamHandlers[teamId as keyof typeof teamHandlers]()
	}

	if (!result) {
		throw new Error(`Something went wrong fetching depth charts for teamId: ${teamId}`)
	}

	await db.depthChartList.create({
		data: {
			teamId: teamId,
			value: JSON.stringify(result),
			year: year,
		},
		select: {
			id: true,
			teamId: true,
			value: true,
			year: true,
			createdAt: true,
			updatedAt: true,
		},
	})

	const allResults = await Promise.all(
		result.map(async (chart: DepthChartObject) => {
			return await db.depthChart.create({
				data: {
					teamId: teamId,
					title: chart.title,
					value: chart.href,
					year: year,
				},
				select: {
					id: true,
					teamId: true,
					value: true,
					year: true,
					createdAt: true,
					updatedAt: true,
				},
			})
		})
	)

	allResults.map((result) => {
		console.log('Depth chart created:')
		console.log(`teamId: ${result.teamId}`)
		console.log(`${result.value}`)
	})

	console.log(`saveAllDepthCharts teamId:${teamId} complete`)
	return true
}
