import { Account } from '@prisma/client'
import { authenticator } from '~/utils/auth/auth.server'

export type HomeLoaderData = {
	account: Account
}

export const homeLoader = async (request: Request) => {
	const account = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	return {
		account
	}
}
