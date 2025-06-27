import { LoaderFunctionArgs } from '@remix-run/node'
import Result, { err, ok } from 'true-myth/result'
import { db } from '~/lib/db.server'

import type { Error } from '~/types'
import type { AuthAccount } from '~/utils/auth/auth.server'

export type ParseUnsubscribeLoaderOutput = { accountUUID: string; depthChartUUID: string }

export const parseUnsubscribeLoader = async ({
	account,
	params,
}: {
	account: AuthAccount
	params: LoaderFunctionArgs['params']
}): Promise<Result<ParseUnsubscribeLoaderOutput, Error>> => {
	const depthChartLookup = await db.depthChart.findUnique({
		where: {
			uuid: params.depthChart,
		},
	})

	if (account.uuid !== params.account) {
		return err({
			message: 'Account could not be validated',
			code: 404,
		})
	}
	if (!depthChartLookup) {
		return err({
			message: 'DepthChart could not be validated',
			code: 404,
		})
	}

	return ok({
		accountUUID: account.uuid,
		depthChartUUID: depthChartLookup.uuid,
	})
}
