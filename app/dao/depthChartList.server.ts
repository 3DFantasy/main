import Result, { err, ok } from 'true-myth/result'
import { db } from '~/lib/db.server'
import { logger } from '~/utils/logger'

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

const fileName = 'dao/depthChartList.server.ts'

export async function compareDepthChartList({
    teamId,
    year,
    value,
}: CheckAndUpdateDepthChartInput): Promise<
    Result<CheckAndUpdateDepthChartOutput, Error>
> {
    let depthChartList: DepthChartList | null = null
    let newDepthChart: DepthChartObject | null = null

    const currentDepthChartList = await db.depthChartList.findMany({
        where: {
            teamId,
            year,
        },
    })

    if (currentDepthChartList.length === 0) {
        logger.info(
            fileName,
            `No depth chart list for year ${year}, teamId ${teamId} created yet, creating now..`
        )
        const createdDepthChartList = await db.depthChartList.create({
            data: {
                year,
                teamId,
                value: JSON.stringify(value),
            },
        })
        depthChartList = parseDepthChartList({
            depthChartList: createdDepthChartList,
        })
        newDepthChart = value[value.length - 1]

        return ok({ depthChartList, newDepthChart })
    } else if (currentDepthChartList.length > 1) {
        return err({
            message: `More than 1 depth chart list for year: ${year} & teamId:${teamId} exists`,
            code: 500,
        })
    } else {
        logger.info(
            fileName,
            `DepthChartList retrieved for ${year}, teamId ${teamId}`
        )
        depthChartList = parseDepthChartList({
            depthChartList: currentDepthChartList[0],
        })
    }

    if (depthChartList.value.length === value.length) {
        logger.info(
            fileName,
            `No new depth chart found: ${year} & teamId:${teamId}`
        )
    } else {
        newDepthChart = value[value.length - 1]
        logger.info(
            fileName,
            `New depth chart title: ${newDepthChart.title}; url: ${newDepthChart.href}`
        )
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
