import { LoaderFunctionArgs } from '@remix-run/node'
import Result, { err, ok } from 'true-myth/result'
import { db } from '~/lib/db.server'

import type { Error } from '~/types'

export type ParseUnsubscribeLoaderOutput = {
    accountUUID: string
    depthChartUUID: string
}

export const parseUnsubscribeLoader = async ({
    params,
}: {
    params: LoaderFunctionArgs['params']
}): Promise<Result<ParseUnsubscribeLoaderOutput, Error>> => {
    const accountLookup = await db.account.findUnique({
        where: {
            uuid: params.account,
        },
    })
    if (!accountLookup) {
        return err({
            message: 'Account could not be validated',
            code: 404,
        })
    }
    const depthChartLookup = await db.depthChart.findUnique({
        where: {
            uuid: params.depthChart,
        },
    })

    if (!depthChartLookup) {
        return err({
            message: 'DepthChart could not be validated',
            code: 404,
        })
    }

    return ok({
        accountUUID: accountLookup.uuid,
        depthChartUUID: depthChartLookup.uuid,
    })
}
