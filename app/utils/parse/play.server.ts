import { driveCreate, driveUpdate, playCreate, playUpdate } from '~/dao/index.server'
import type { PXPAPIResponseInfoObj } from '~/types'

export type ParsePlaysInput = {
	gameId: string
	playArray: PXPAPIResponseInfoObj[]
}

export async function parsePlays({ gameId, playArray }: ParsePlaysInput) {
	const processedDrives = new Map<string, any>()
	let previousPlay: { id: string } | null = null

	for (const play of playArray) {
		if (play.type === 'Kickoff') {
			previousPlay = null
			return
		}

		const [driveNumber, playNumber] = play.id.split('-')

		let thisDrive = await processedDrives.get(driveNumber)

		if (!thisDrive) {
			thisDrive = await driveCreate({
				data: {
					gameId,
					geniusTeamId: play.teamId,
					number: Number(driveNumber),
				},
			})

			processedDrives.set(driveNumber, thisDrive) // Cache the drive
		}

		const createdPlay = await playCreate({
			data: {
				clock: play.clock,
				description: play.description,
				driveId: thisDrive.id,
				number: Number(playNumber),
				gameId,
				geniusTeamId: play.teamId,
				isScoring: play.isScoring,
				phase: play.phase,
				phaseQualifier: play.phaseQualifier,
				startPosition: play.playStartPosition,
				subtype: play.subType,
				timestamp: play.timestamp,
				type: play.type,
			},
		})

		if (previousPlay) {
			await playUpdate({
				where: { id: previousPlay.id },
				data: { endPosition: play.playStartPosition },
			})
		}

		if (play.isScoring) {
			const points =
				play.subType === 'Touchdown'
					? 7
					: play.type === 'FieldGoal'
					? 3
					: play.type === 'TwoPoint'
					? 2
					: play.type === 'OnePoint'
					? 1
					: null

			await driveUpdate({
				where: {
					id: thisDrive.id,
				},
				data: {
					isScoring: true,
					points: points,
				},
			})
		}

		previousPlay = createdPlay

		const isLastPlayOfDrive =
			playArray.indexOf(play) === playArray.length - 1 ||
			playArray[playArray.indexOf(play) + 1].id.split('-')[0] !== driveNumber

		if (isLastPlayOfDrive) {
			previousPlay = null
		}
	}
}
