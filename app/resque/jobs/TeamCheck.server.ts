import { compareDepthChartList } from '~/dao/depthChartList.server'
import { db } from '~/lib/db.server'

import type { DepthChartObject } from '~/types'

export async function TeamCheck({
	teamId,
	teamCheckFunc,
}: {
	teamId: number
	teamCheckFunc: () => Promise<DepthChartObject[]>
}) {
	const year = Number(process.env.LEAGUE_YEAR)

	const result = await teamCheckFunc()

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
	}

	console.log(`Team${teamId}Check complete`)
	return true
}
