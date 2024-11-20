import { db } from '~/lib/db.server'

export type DepthChartUpdateInput = {
	data: {
		value: string
	}
	where: {
		id: string
	}
}

export async function depthChartUpdate({
	data,
	where,
}: DepthChartUpdateInput): Promise<typeof depthChart> {
	const depthChart = await db.depthChart.update({
		data: data,
		where: where,
		select: {
			id: true,
			teamId: true,
			value: true,
			year: true,
		},
	})
	return depthChart
}

export type DepthChartFindUniqueInput = {
	where: {
		id: string
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

export type DepthChartCreateInput = {
	data: {
		teamId: number
		value: string
		year: number
		title: string
	}
}

export async function depthChartCreate({ data }: DepthChartCreateInput): Promise<typeof depthChart> {
	const depthChart = await db.depthChart.create({
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
