import { depthChartCreate } from '~/dao/index.server'
import { depthChartListCreate } from '~/dao/depthChartList.server'

import type { DepthChartObject } from '~/types'

export async function saveAllDepthCharts({
	result,
	teamId,
	year,
}: {
	result: DepthChartObject[]
	teamId: number
	year: number
}) {
	const depthChartList = await depthChartListCreate({
		data: {
			teamId: teamId,
			value: JSON.stringify(result),
			year: year,
		},
	})

	const resp = Promise.all(
		result.map(async (chart: DepthChartObject) => {
			return await depthChartCreate({
				data: {
					teamId: teamId,
					title: chart.title,
					value: chart.href,
					year: year,
				},
			})
		})
	)
}
