export const rootLoader = async (request: Request) => {
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

	return {}
}
