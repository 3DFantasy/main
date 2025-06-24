import { AuthAccount, authenticator } from '~/utils/auth/auth.server'

export type LoaderData = {
	account: AuthAccount
}

export const homeLoader = async (request: Request) => {
	const account = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	return {
		account,
	}
}
