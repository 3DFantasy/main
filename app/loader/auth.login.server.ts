import { authenticator } from '~/utils/auth/auth.server'

export type LoaderData = {
	nextUrl?: string
}

export const authLoginLoader = async (request: Request) => {
	const url = new URL(request.url)
	const nextUrl = url.searchParams.get('nextUrl')
	await authenticator.isAuthenticated(request, {
		successRedirect: '/home',
	})

	return { nextUrl }
}
