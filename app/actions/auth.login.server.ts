import { authenticator } from '~/utils/auth/auth.server'

export const authLoginAction = async (request: Request) => {
	return authenticator.authenticate('login', request, {
		successRedirect: '/home',
		failureRedirect: '/auth/login?error=credentials',
	})
}
