import { authenticator } from '~/utils/auth/auth.server'
import { calculateExpectedPoints } from '~/utils/parse/expectedPoints.server'

export const rootLoader = async (request: Request) => {
	const account = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	await calculateExpectedPoints({
		down: 1,
		distance: '20',
		yardLine: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
	})

	return { account }
}
