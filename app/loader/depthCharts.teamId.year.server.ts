import { LoaderFunctionArgs } from 'react-router'
import { db } from '~/lib/db.server'
import { getCurrentAccount } from '~/utils/auth/auth.server'

import type { DepthChart } from '@prisma/client'

export type LoaderData = {
    depthCharts: DepthChart[]
}

export const depthChartsTeamIdYearLoader = async (
    request: Request,
    params: LoaderFunctionArgs['params']
) => {
    await getCurrentAccount(request)

    const depthCharts = await db.depthChart.findMany({
        where: {
            year: Number(params.year),
            Team: {
                uuid: params.teamId,
            },
        },
        orderBy: {
            id: 'asc',
        },
    })

    return { depthCharts }
}
