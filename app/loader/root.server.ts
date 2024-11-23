import { gameFindMany } from '~/dao/index.server'
import { authenticator } from '~/utils/auth/auth.server'
import { parsePlays } from '~/utils/parse/index.server'
import {
	Team1Check,
	Team2Check,
	Team3Check,
	Team4Check,
	Team5Check,
	Team6Check,
	Team7Check,
	Team8Check,
	Team9Check,
} from '~/utils/puppeteer'

import type { PXPAPIResponse } from '~/types'

export const rootLoader = async (request: Request) => {
	const account = await authenticator.isAuthenticated(request)

	const games = await gameFindMany({
		where: {
			year: 2023,
		},
	})
	for (const game of games) {
		const parsedPlayArray = (await JSON.parse(game.response)) as PXPAPIResponse
		const parsedPlays = await parsePlays({
			gameId: game.id,
			playArray: parsedPlayArray.data.playByPlayInfo.ALL.reverse(),
		})
	}
	return { account }
}
