import { Account } from '@prisma/client'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/utils/auth/auth.server'

export type LoaderData = {
	account: Account
}

export const adminLoader = async (request: Request) => {
	const account: Account = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	if (account.role !== 'ADMIN') {
		return redirect('/home')
	}

	return {
		account,
	}
}
