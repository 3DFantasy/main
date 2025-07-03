import { db } from '~/lib/db.server'
import { authenticator } from '~/utils/auth/auth.server'
import { getTeamTitles } from '~/utils/getTeamTitles.server'

import type { AuthAccount } from '~/utils/auth/auth.server'

export type LoaderData = {
	account: AuthAccount
	nextUrl?: string
	teams: {
		id: number
		uuid: string
		title: string
		key: string
	}[]
}

export const homeLoader = async (request: Request) => {
	const url = new URL(request.url)
	const nextUrl = url.searchParams.get('nextUrl')

	const account: AuthAccount = await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	const teams = await db.team.findMany({
		select: {
			id: true,
			uuid: true,
		},
	})
	const teamTitles = getTeamTitles()

	return {
		account,
		nextUrl,
		teams: teams.map((team) => {
			const teamTitle = teamTitles.filter((teamTitle) => {
				return teamTitle.value.includes(team.id.toString())
			})[0]
			return {
				id: team.id,
				uuid: team.uuid,
				title: teamTitle.title,
				key: teamTitle.value,
			}
		}),
	}
}
