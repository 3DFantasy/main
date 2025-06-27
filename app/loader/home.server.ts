import { authenticator } from '~/utils/auth/auth.server'

import type { AuthAccount } from '~/utils/auth/auth.server'

export type LoaderData = {
	account: AuthAccount
}

export const homeLoader = async (request: Request) => {
	const account: AuthAccount = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	return {
		account,
	}
}
