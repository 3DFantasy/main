import { authenticator } from '~/utils/auth/auth.server'

export const authSignupAction = async (request: Request) => {
	return authenticator.authenticate('signup', request, {
		successRedirect: '/home',
		failureRedirect: '/auth/signup?error=true',
	})
}
