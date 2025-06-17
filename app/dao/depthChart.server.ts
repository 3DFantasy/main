import Result, { err, ok } from 'true-myth/result'
import { teamFindUnique } from '~/dao/index.server'
import { db } from '~/lib/db.server'

import type { DepthChartObject, Error } from '~/types'

export type DepthChartUpdateInput = {
	data: {
		value: string
	}
	where: {
		id: number
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

export type CheckAndUpdateDepthChartResponse = { message: string; code: number }

export async function checkAndUpdateDepthChart({
	teamId,
	year,
	depthChart,
}: CheckAndUpdateDepthChartInput): Promise<Result<CheckAndUpdateDepthChartResponse, Error>> {
	const team = await teamFindUnique({
		where: {
			id: teamId,
		},
	})
	if (!team) {
		return err({
			message: 'No team with that ID found',
			code: 404,
		})
	}
	const currentDepthChart = team.depthChart.filter((depthChart) => depthChart.year === year)

	if (currentDepthChart.length === 0) {
		db.depthChart
	} else if (currentDepthChart.length > 1) {
		return err({
			name: 'FetchDepthChart',
			message: `More than 1 depth chart for year: ${year} exists, teamId:${teamId}`,
			code: 500,
		})
	}

	if (currentDepthChart[0].value !== JSON.stringify(depthChart)) {
		const updatedDepthChart = await depthChartUpdate({
			where: {
				id: currentDepthChart[0].id,
			},
			data: { value: JSON.stringify(depthChart) },
		})

		if (!updatedDepthChart) {
			return err({
				name: 'UpdateDepthChart',
				message: 'Something went wrong updating depth chart',
				code: 500,
			})
		} else {
			return ok({
				code: 200,
				message: 'Depth chart updated',
			})
		}
	} else {
		return ok({
			message: 'No changes to update',
			code: 202,
		})
	}
}

export async function saveAllDepthCharts({
	result,
	teamId,
	year,
}: {
	result: DepthChartObject[]
	teamId: number
	year: number
}) {
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

	Promise.all(
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
}
