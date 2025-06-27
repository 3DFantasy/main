import { LoaderFunctionArgs } from '@remix-run/node'
import { db } from '~/lib/db.server'
import { authenticator } from '~/utils/auth/auth.server'
import { getTeamCheckBoxes } from '~/utils/index.server'
import { parseUnsubscribeLoader } from '~/utils/parse/loaders/unsubscribe.server'

import type { Account } from '@prisma/client'
import type { AuthAccount } from '~/utils/auth/auth.server'
import type { TeamCheckBoxObj } from '~/utils/getTeamCheckBoxes.server'

export type LoaderData = {
	account: Account
	teamCheckBoxes: TeamCheckBoxObj[]
	message?: string
	code?: number
}

export const unsubscribeLoader = async (request: Request, params: LoaderFunctionArgs['params']) => {
	const authAccount: AuthAccount = await authenticator.isAuthenticated(request, {
		failureRedirect: `/auth/login?nextUrl=unsubscribe/${params.account}/${params.depthChart}`,
	})

	const parsedParams = await parseUnsubscribeLoader({
		account: authAccount,
		params,
	})

	const teamCheckBoxes = getTeamCheckBoxes()

	if (parsedParams.isErr) {
		return {
			message: parsedParams.error.message,
			code: parsedParams.error.code,
			teamCheckBoxes,
		}
	}

	const account = await db.account.findUnique({
		where: {
			id: authAccount.id,
		},
	})

	return { account, teamCheckBoxes }
}
