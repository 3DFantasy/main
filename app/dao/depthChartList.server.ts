import Result, { err, ok } from 'true-myth/result'
import { db } from '~/lib/db.server'

import type { DepthChartList as DepthChartListPrisma } from '~/lib/db.server'
import type { DepthChartObject, Error } from '~/types'

export type CheckAndUpdateDepthChartInput = {
	teamId: number
	year: number
	value: DepthChartObject[]
}

export type DepthChartList = {
	id: number
	uuid: string
	teamId: number
	value: DepthChartObject[]
	year: number
	createdAt: Date
	updatedAt: Date
}

export type CheckAndUpdateDepthChartOutput = {
	depthChartList: DepthChartList
	newDepthChart: DepthChartObject | null
}

export async function compareDepthChartList({
	teamId,
	year,
	value,
}: CheckAndUpdateDepthChartInput): Promise<Result<CheckAndUpdateDepthChartOutput, Error>> {
	let depthChartList: DepthChartList | null = null
	let newDepthChart: DepthChartObject | null = null

	const currentDepthChartList = await db.depthChartList.findMany({
		where: {
			teamId,
			year,
		},
	})

	if (currentDepthChartList.length === 0) {
		console.log(`No depth chart list for year ${year}, teamId ${teamId} created yet, creating now..`)
		const createdDepthChartList = await db.depthChartList.create({
			data: {
				year,
				teamId,
				value: JSON.stringify(value),
			},
		})
		depthChartList = parseDepthChartList({ depthChartList: createdDepthChartList })
		newDepthChart = value[value.length - 1]

		return ok({ depthChartList, newDepthChart })
	} else if (currentDepthChartList.length > 1) {
		return err({
			message: `More than 1 depth chart list for year: ${year} & teamId:${teamId} exists`,
			code: 500,
		})
	} else {
		console.log(`DepthChartList retrieved for ${year}, teamId ${teamId}`)
		depthChartList = parseDepthChartList({ depthChartList: currentDepthChartList[0] })
	}

	if (depthChartList.value.length === value.length) {
		console.log(`No new depth chart found: ${year} & teamId:${teamId}`)
	} else {
		newDepthChart = value[value.length - 1]
		console.log('new depth chart:', newDepthChart)
	}
	return ok({ depthChartList, newDepthChart })
}

export function parseDepthChartList({
	depthChartList,
}: {
	depthChartList: DepthChartListPrisma
}): DepthChartList {
	if (typeof depthChartList.value === 'string') {
		const depthChartListFinal = {
			...depthChartList,
			value: JSON.parse(depthChartList.value) as DepthChartObject[],
		}
		return depthChartListFinal
	} else {
		throw new Error(`depthChartList value is null, could not parse`)
	}
}
