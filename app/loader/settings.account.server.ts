import { authenticator } from '~/utils/auth/auth.server'

// import { db } from '~/lib/db.server'

export type LoaderData = {
	// account: TeamCheckBoxObj[]
}

export const settingsAccountLoader = async (request: Request) => {
	const authAccount = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	return {
		// account
	}
}
