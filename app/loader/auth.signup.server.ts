import { authenticator } from '~/utils/auth/auth.server'

export const authSignupLoader = async (request: Request) => {
	const account = await authenticator.isAuthenticated(request, {
		successRedirect: '/home',
	})

	return { account }
}
