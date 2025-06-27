import Result, { ok } from 'true-myth/result'

import type { Error } from '~/types'

export type ParseApiTeamCheckActionOutput = {
	team1: boolean
	team2: boolean
	team3: boolean
	team4: boolean
	team5: boolean
	team6: boolean
	team7: boolean
	team8: boolean
	team9: boolean
}

export const parseApiTeamCheckAction = ({
	formData,
}: {
	formData: FormData
}): Result<{ teamCheck: ParseApiTeamCheckActionOutput }, Error> => {
	const teamCheck: ParseApiTeamCheckActionOutput = Array.from(
		{ length: 9 },
		(_, i) => `team${i + 1}`
	).reduce((acc: any, team) => {
		acc[team] = false
		return acc
	}, {})

	for (let i = 1; i <= 9; i++) {
		const teamKey = `team${i}`
		const teamValue = formData.get(teamKey)

		if (typeof teamValue === 'string' && teamValue === 'true') {
			teamCheck[teamKey as keyof typeof teamCheck] = true
		}
	}

	return ok({ teamCheck })
}
