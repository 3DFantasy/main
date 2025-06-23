import { Account } from '@prisma/client'
import { authenticator } from '~/utils/auth/auth.server'

export type LoaderData = {
	account: Account
	error: boolean
}

export const authSignupLoader = async (request: Request) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')
	const account: Account | null = await authenticator.isAuthenticated(request, {
		successRedirect: '/home',
	})

	return { account, error: error === 'true' ? true : false }
}
