import Result, { err, ok } from 'true-myth/result'
import { teamFindUnique, depthChartUpdate } from '../../dao'

import type { DepthChartObject } from '~/types'

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
			name: 'TeamFindUnique',
			message: 'No team with that ID found',
			code: 404,
		})
	}
	const currentDepthChart = team.depthChart.filter(
		(depthChart: CheckAndUpdateDepthChartInput) => depthChart.year === year
	)

	if (currentDepthChart.length === 0 || currentDepthChart.length > 1) {
		return err({
			name: 'FetchDepthChart',
			message: 'Something went wrong fetching depth chart',
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
