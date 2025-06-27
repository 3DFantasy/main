import { LoaderFunctionArgs } from '@remix-run/node'
import { authenticator } from '~/utils/auth/auth.server'
import { parseUnsubscribeLoader } from '~/utils/parse/loaders/unsubscribe.server'

import type { AuthAccount } from '~/utils/auth/auth.server'

export type LoaderData = {
	account?: AuthAccount | null
	message?: string
	code?: number
}

export const unsubscribeLoader = async (request: Request, params: LoaderFunctionArgs['params']) => {
	const account: AuthAccount = await authenticator.isAuthenticated(request, {
		failureRedirect: `/auth/login?nextUrl=unsubscribe/${params.account}/${params.depthChart}`,
	})

	const parsedParams = await parseUnsubscribeLoader({
		account,
		params,
	})

	if (parsedParams.isErr) {
		return {
			message: parsedParams.error.message,
			code: parsedParams.error.code,
		}
	}

	return { account }
}
