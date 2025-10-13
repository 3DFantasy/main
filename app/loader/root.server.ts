import { authenticator } from '~/utils/auth/auth.server'

import type { AuthAccount } from '~/utils/auth/auth.server'

export type LoaderData = {
    account: AuthAccount | null
}

export const rootLoader = async (request: Request) => {
    const account: AuthAccount | null = await authenticator.isAuthenticated(
        request,
        {}
    )

    // resqueTask({
    // 	job: 'teamCheck',
    // 	teamCheckProps: {
    // 		teamId: 1,
    // 	},
    // })
    // const points: number[] = []

    // const plays = await playFindMany({
    // 	where: {
    // 		type: 'Run',
    // 		down: null,
    // 		isScoring: false,
    // 		startPosition: '',
    // 	},
    // })

    // // const sum = points.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

    // // console.log((sum / plays.length).toFixed(2))

    // // console.log(plays.length)

    // // const games = await gameFindMany({
    // // 	where: {
    // // 		year: 2023,
    // // 	},
    // // })
    // // for (const game of games) {
    // // 	const parsedPlayArray = (await JSON.parse(game.response)) as PXPAPIResponse
    // // 	const parsedPlays = await parsePlays({
    // // 		gameId: game.id,
    // // 		playArray: parsedPlayArray.data.playByPlayInfo.ALL.reverse(),
    // // 	})
    // // }

    return { account }
}
