import { redirect } from '@remix-run/node'
import { authenticator } from '~/utils/auth/auth.server'
import { getTeamTitles } from '~/utils/index.server'

import type { AuthAccount } from '~/utils/auth/auth.server'
import type { TeamTitleObj } from '~/utils/getTeamTitles.server'

export type LoaderData = {
	teamTitles: TeamTitleObj[]
}

export const adminLoader = async (request: Request) => {
	const account: AuthAccount = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	if (account.role !== 'ADMIN') {
		return redirect('/home')
	}

	const teamTitles = getTeamTitles()

	return {
		teamTitles,
	}
}
