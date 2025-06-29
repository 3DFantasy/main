import { AuthAccount, authenticator } from '~/utils/auth/auth.server'
import { getTeamCheckBoxes } from '~/utils/index.server'

import type { TeamCheckBoxObj } from '~/utils/getTeamCheckBoxes.server'

export type LoaderData = {
	account: AuthAccount
	teamCheckBoxes: TeamCheckBoxObj[]
}

export const settingsNotificationLoader = async (request: Request) => {
	const account: AuthAccount = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	const teamCheckBoxes = getTeamCheckBoxes()

	return {
		account,
		teamCheckBoxes,
	}
}
