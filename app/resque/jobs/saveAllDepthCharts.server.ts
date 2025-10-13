import { db } from '~/lib/db.server'
import { logger } from '~/utils/logger'
import { teamHandlers } from '~/utils/puppeteer/index.server'
import { getDepthChartInfo } from '~/utils/getDepthChartInfo.server'

import type { DepthChartObject } from '~/types'

const fileName = 'resque/jobs/saveAllDepthCharts.server.ts'

export async function saveAllDepthCharts({
    teamId,
}: {
    teamId: number
}): Promise<boolean> {
    const year = Number(process.env.LEAGUE_YEAR)
    let result: DepthChartObject[] | null = null
    if (teamHandlers[teamId as keyof typeof teamHandlers]) {
        result = await teamHandlers[teamId as keyof typeof teamHandlers]()
    }

    if (!result) {
        throw new Error(
            `Something went wrong fetching depth charts for teamId: ${teamId}`
        )
    }

    const newDepthChartList = await db.depthChartList.create({
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

    const allResults = await Promise.all(
        result.map(async (chart: DepthChartObject) => {
            const depthChartDateInfo = getDepthChartInfo(new Date())

            return await db.depthChart.create({
                data: {
                    teamId: teamId,
                    title: chart.title,
                    value: chart.href,
                    year: year,
                    depthChartListId: newDepthChartList.id,
                    season: depthChartDateInfo.season,
                    week: depthChartDateInfo.week,
                },
                select: {
                    id: true,
                    teamId: true,
                    value: true,
                    year: true,
                    season: true,
                    week: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })
        })
    )

    allResults.map((result) => {
        logger.info(fileName, 'Depth chart created:')
        logger.info(fileName, `teamId: ${result.teamId}`)
        logger.info(fileName, `season: ${result.season}, week:${result.week}`)
        logger.info(fileName, `${result.value}`)
    })

    logger.info(fileName, `saveAllDepthCharts teamId:${teamId} complete`)
    return true
}
