import { authenticator } from '~/utils/auth/auth.server'

export const indexLoader = async (request: Request) => {
	const account = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	return { account }
}
