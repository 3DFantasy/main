import { db } from '~/lib/db.server'

import type { DepthChartObject } from '~/types'

export type DepthChartFindUniqueInput = {
	where: {
		id: number
		year: number
	}
}

export async function depthChartFindUnique({
	where,
}: DepthChartFindUniqueInput): Promise<typeof depthChart> {
	const depthChart = await db.depthChart.findUnique({
		where: where,
		select: {
			id: true,
			value: true,
			year: true,
			updatedAt: true,
		},
	})
	return depthChart
}

export type CheckAndUpdateDepthChartInput = {
	teamId: number
	year: number
	depthChart: DepthChartObject[]
}
