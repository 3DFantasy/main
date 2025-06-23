import { Account } from '@prisma/client'
import { authenticator } from '~/utils/auth/auth.server'

export type LoaderData = {
	account: Account
}

export const homeLoader = async (request: Request) => {
	const account: Account = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	return {
		account,
	}
}
