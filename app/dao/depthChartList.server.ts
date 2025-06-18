import Result, { err, ok } from 'true-myth/result'
import { db, DepthChartList } from '~/lib/db.server'

import { DepthChartObject, Error } from '~/types'

export type CheckAndUpdateDepthChartInput = {
	teamId: number
	year: number
	value: DepthChartObject[]
}

export type CheckAndUpdateDepthChartOutput = {
	depthChartList: DepthChartList
	newDepthChart: null | DepthChartObject
}

export async function compareDepthChartList({
	teamId,
	year,
	value,
}: CheckAndUpdateDepthChartInput): Promise<Result<CheckAndUpdateDepthChartOutput, Error>> {
	let depthChartList: DepthChartList | null = null
	let newDepthChart: null | DepthChartObject = null

	const currentDepthChartList = await db.depthChartList.findMany({
		where: {
			teamId,
			year,
		},
	})

	if (currentDepthChartList.length === 0) {
		depthChartList = await db.depthChartList.create({
			data: {
				year,
				teamId,
				value: JSON.stringify(value),
			},
		})
		newDepthChart = value[value.length - 1]

		return ok({ depthChartList, newDepthChart })
	} else if (currentDepthChartList.length > 1) {
		return err({
			message: `More than 1 depth chart list for year: ${year} & teamId:${teamId} exists`,
			code: 500,
		})
	} else {
		depthChartList = currentDepthChartList[0]
	}

	try {
		if (typeof depthChartList.value === 'string') {
			const existingDepthChartList: DepthChartObject[] = JSON.parse(depthChartList.value)
			if (existingDepthChartList.length === value.length) {
				console.log(`No new depth chart found: ${year} & teamId:${teamId}`)
			} else {
				newDepthChart = value[value.length - 1]
				console.log('new depth chart:', newDepthChart)
			}
			return ok({ depthChartList, newDepthChart })
		} else {
			return err({
				message: `depthChartList value is null: ${year} & teamId:${teamId}`,
				code: 500,
			})
		}
	} catch (e) {
		return err({
			message: `${e}: ${year} & teamId:${teamId}`,
			code: 500,
		})
	}
}
