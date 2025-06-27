import { redirect } from '@remix-run/node'
import { authenticator } from '~/utils/auth/auth.server'
import { getTeamCheckBoxes } from '~/utils/index.server'

import type { AuthAccount } from '~/utils/auth/auth.server'
import type { TeamCheckBoxObj } from '~/utils/getTeamCheckBoxes.server'

export type LoaderData = {
	teamCheckBoxes: TeamCheckBoxObj[]
}

export const adminLoader = async (request: Request) => {
	const account: AuthAccount = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	if (account.role !== 'ADMIN') {
		return redirect('/home')
	}

	const teamCheckBoxes = getTeamCheckBoxes()

	return {
		teamCheckBoxes,
	}
}
