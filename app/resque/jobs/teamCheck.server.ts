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

	const depthChartList = await compareDepthChartList({
		teamId,
		year,
		value: result,
	})

	if (depthChartList.isErr) {
		throw new Error(depthChartList.error.message)
	}

	if (depthChartList.value.newDepthChart) {
		await db.depthChart.create({
			data: {
				teamId,
				title: depthChartList.value.newDepthChart.title,
				value: depthChartList.value.newDepthChart.href,
				year,
			},
		})
		// send email
	}

	console.log(`Team${teamId}Check complete`)
	return true
}
