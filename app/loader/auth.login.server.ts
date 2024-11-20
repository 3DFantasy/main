import { authenticator } from '~/utils/auth/auth.server'

export const authLoginLoader = async (request: Request) => {
	// const url = new URL(request.url)
	// const error = url.searchParams.get('error')
	const account = await authenticator.isAuthenticated(request, {
		successRedirect: '/home',
	})

	return { account }
}
