import { compareDepthChartList } from '~/dao/depthChartList.server'
import { db } from '~/lib/db.server'
import { teamHandlers } from '~/utils/puppeteer/index.server'

import type { DepthChartObject } from '~/types'

export async function teamCheck({ teamId }: { teamId: number }) {
	const year = Number(process.env.LEAGUE_YEAR)

	let result: DepthChartObject[] | null = null
	if (teamHandlers[teamId as keyof typeof teamHandlers]) {
		result = await teamHandlers[teamId as keyof typeof teamHandlers]()
	}

	if (!result) {
		throw new Error(`Something went wrong fetching depth charts for teamId: ${teamId}`)
	}

	const compareDepthChartListResp = await compareDepthChartList({
		teamId,
		year,
		value: result,
	})

	if (compareDepthChartListResp.isErr) {
		throw new Error(compareDepthChartListResp.error.message)
	}

	if (compareDepthChartListResp.value.newDepthChart) {
		// create new chart
		await db.depthChart.create({
			data: {
				teamId,
				title: compareDepthChartListResp.value.newDepthChart.title,
				value: compareDepthChartListResp.value.newDepthChart.href,
				year,
			},
		})

		// update existing list
		await db.depthChartList.update({
			where: {
				id: compareDepthChartListResp.value.depthChartList.id,
			},
			data: {
				value: JSON.stringify(result),
			},
		})
		// send email
	}

	console.log(`Team${teamId}Check complete`)
	return true
}
