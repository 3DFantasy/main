import { authenticator } from '~/utils/auth/auth.server'

export type LoaderData = {
	years: number[]
}

export const homeTeamIdLoader = async (request: Request) => {
	// const url = new URL(request.url)
	await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	return {
		years: [2024, 2025],
	}
}
