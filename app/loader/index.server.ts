import { redirect } from '@remix-run/node'
import { authenticator } from '~/utils/auth/auth.server'

export const indexLoader = async (request: Request) => {
	await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	return redirect('/home')

	// return { account }
}
