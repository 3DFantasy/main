import { authenticator } from '~/utils/auth/auth.server'

import type { AuthAccount } from '~/utils/auth/auth.server'

export type LoaderData = {
	account: AuthAccount
	nextUrl?: string
}

export const homeLoader = async (request: Request) => {
	const url = new URL(request.url)
	const nextUrl = url.searchParams.get('nextUrl')

	const account: AuthAccount = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	return {
		account,
		nextUrl,
	}
}
