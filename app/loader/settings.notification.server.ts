import { authenticator } from '~/utils/auth/auth.server'
import { getTeamCheckBoxes } from '~/utils/index.server'

import type { TeamCheckBoxObj } from '~/utils/getTeamCheckBoxes.server'

export type LoaderData = {
	teamCheckBoxes: TeamCheckBoxObj[]
}

export const settingsNotificationLoader = async (request: Request) => {
	await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	const teamCheckBoxes = getTeamCheckBoxes()

	return {
		teamCheckBoxes,
	}
}
