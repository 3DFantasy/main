import { gameFindMany, playFindMany, playFindUnique, playUpdate } from '~/dao/index.server'
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
import { teamArray } from '~/data/teamArray'

export const rootLoader = async (request: Request) => {
	const account = await authenticator.isAuthenticated(request)

	const points: number[] = []

	const plays = await playFindMany({
		where: {
			type: 'Run',
			down: null,
			isScoring: false,
			startPosition: '',
		},
	})

	console.log(plays.length)

	// plays.map(async (play) => {
	// 	console.log('---------------------------')
	// 	const teamAbr = teamArray.filter((team) => {
	// 		return team.geniusTeamId === play.geniusTeamId
	// 	})[0].abr
	// 	// console.log(play.description)
	// 	const previousPlay = await playFindUnique({
	// 		where: {
	// 			driveId: play.Drive.id,
	// 			number: play.number - 1,
	// 		},
	// 	})
	// 	const previousPlayYardLine = previousPlay[0].startPosition.slice(-2)
	// 	const downNDistance = previousPlay[0].startPosition.includes('1st') ? '2nd & 1 at ' : '3rd & 1 at '
	// 	if (previousPlay[0].startPosition.includes(teamAbr) && previousPlay[0].yardsGained) {
	// 		const startPositionYardLine = Number(previousPlayYardLine) + previousPlay[0].yardsGained
	// 		if (startPositionYardLine < 55) {
	// 			const newStartPosition = downNDistance + teamAbr + ' ' + startPositionYardLine
	// 			if (previousPlay[0].endPosition === '') {
	// 				const previousPlayUpdates = await playUpdate({
	// 					where: {
	// 						id: previousPlay[0].id,
	// 					},
	// 					data: {
	// 						endPosition: newStartPosition,
	// 					},
	// 				})
	// 			}

	// 			const updatedPlay = await playUpdate({
	// 				where: {
	// 					id: play.id,
	// 				},
	// 				data: {
	// 					startPosition: newStartPosition,
	// 					down: previousPlay[0].startPosition.includes('1st') ? 2 : 3,
	// 					distance: '1',
	// 					yardLine: -startPositionYardLine,
	// 				},
	// 			})
	// 			console.log(updatedPlay.id)
	// 		}
	// 	} else if (!previousPlay[0].startPosition.includes(teamAbr) && previousPlay[0].yardsGained) {
	// 		const startPositionYardLine = Number(previousPlayYardLine) - previousPlay[0].yardsGained
	// 		const part1 = previousPlay[0].startPosition.slice(0, 11)
	// 		const part2 = previousPlay[0].startPosition.slice(-2)

	// 		const newStartPosition = previousPlay[0].startPosition
	// 			.replace(part1, downNDistance)
	// 			.replace(part2, startPositionYardLine.toString())

	// 		if (previousPlay[0].endPosition === '') {
	// 			const previousPlayUpdates = await playUpdate({
	// 				where: {
	// 					id: previousPlay[0].id,
	// 				},
	// 				data: {
	// 					endPosition: newStartPosition,
	// 				},
	// 			})
	// 		}

	// 		const updatedPlay = await playUpdate({
	// 			where: {
	// 				id: play.id,
	// 			},
	// 			data: {
	// 				startPosition: newStartPosition,
	// 				down: previousPlay[0].startPosition.includes('1st') ? 2 : 3,
	// 				distance: '1',
	// 				yardLine: startPositionYardLine,
	// 			},
	// 		})
	// 		console.log(updatedPlay.id)
	// 	}
	// })

	// const sum = points.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

	// console.log((sum / plays.length).toFixed(2))

	// console.log(plays.length)

	// const games = await gameFindMany({
	// 	where: {
	// 		year: 2023,
	// 	},
	// })
	// for (const game of games) {
	// 	const parsedPlayArray = (await JSON.parse(game.response)) as PXPAPIResponse
	// 	const parsedPlays = await parsePlays({
	// 		gameId: game.id,
	// 		playArray: parsedPlayArray.data.playByPlayInfo.ALL.reverse(),
	// 	})
	// }
	return { account }
}
