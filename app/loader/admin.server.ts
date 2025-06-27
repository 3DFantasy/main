import { redirect } from '@remix-run/node'
import { authenticator } from '~/utils/auth/auth.server'

import type { AuthAccount } from '~/utils/auth/auth.server'

export type LoaderData = {
	teamCheckBoxes: {
		value: string
		title: string
	}[]
}

export const adminLoader = async (request: Request) => {
	const account: AuthAccount = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	if (account.role !== 'ADMIN') {
		return redirect('/home')
	}

	const teamCheckBoxes = Array.from({ length: 9 }, (_, i) => {
		const teamNumber = i + 1
		return {
			value: `team${teamNumber}`,
			title: process.env[`TEAM_${teamNumber}_TITLE`],
		}
	})

	return {
		teamCheckBoxes,
	}
}
