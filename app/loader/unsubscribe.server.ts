import { LoaderFunctionArgs } from '@remix-run/node'
import { db } from '~/lib/db.server'
import { authenticator } from '~/utils/auth/auth.server'
import { getTeamTitles } from '~/utils/index.server'
import { parseUnsubscribeLoader } from '~/utils/parse/loaders/unsubscribe.server'

import type { Account } from '@prisma/client'
import type { AuthAccount } from '~/utils/auth/auth.server'
import type { TeamTitleObj } from '~/utils/getTeamTitles.server'

export type LoaderData = {
	account: Account
	teamTitles: TeamTitleObj[]
	message?: string
	code?: number
}

export const unsubscribeLoader = async (request: Request, params: LoaderFunctionArgs['params']) => {
	const authAccount: AuthAccount = await authenticator.isAuthenticated(request, {
		failureRedirect: `/auth/login?nextUrl=/unsubscribe/${params.account}/${params.depthChart}`,
	})

	const parsedParams = await parseUnsubscribeLoader({
		account: authAccount,
		params,
	})

	const teamTitles = getTeamTitles()

	if (parsedParams.isErr) {
		return {
			message: parsedParams.error.message,
			code: parsedParams.error.code,
			teamTitles,
		}
	}

	const account = await db.account.findUnique({
		where: {
			id: authAccount.id,
		},
	})

	return { account, teamTitles }
}
