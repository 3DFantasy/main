import { authenticator } from '~/utils/auth/auth.server'
import { getTeamTitles } from '~/utils/index.server'

import type { TeamTitleObj } from '~/utils/getTeamTitles.server'

export type LoaderData = {
	teamTitles: TeamTitleObj[]
}

export const settingsNotificationLoader = async (request: Request) => {
	await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	const teamTitles = getTeamTitles()

	return {
		teamTitles,
	}
}
