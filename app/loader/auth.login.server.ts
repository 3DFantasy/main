import { authenticator } from '~/utils/auth/auth.server'

export type LoaderData = {
	error: boolean
}

export const authLoginLoader = async (request: Request) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')
	await authenticator.isAuthenticated(request, {
		successRedirect: '/home',
	})

	return { error: error === 'true' ? true : false }
}
