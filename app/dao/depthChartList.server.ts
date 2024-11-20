import { db } from '~/lib/db.server'

export type DepthChartListCreateInput = {
	data: {
		teamId: number
		value: string
		year: number
	}
}

export async function depthChartListCreate({
	data,
}: DepthChartListCreateInput): Promise<typeof depthChart> {
	const depthChart = await db.depthChartList.create({
		data: data,
		select: {
			id: true,
			teamId: true,
			value: true,
			year: true,
			createdAt: true,
			updatedAt: true,
		},
	})
	return depthChart
}
