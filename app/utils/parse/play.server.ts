import { teamArray } from '~/data/teamArray'
import { driveCreate, driveFindUnique, driveUpdate, playCreate, playUpdate } from '~/dao/index.server'

import type { PXPAPIResponseInfoObj } from '~/types'

export type ParsePlaysInput = {
	gameId: string
	playArray: PXPAPIResponseInfoObj[]
}

export async function parsePlays({ gameId, playArray }: ParsePlaysInput) {
	const processedDrives = new Map<string, any>()
	let previousPlay: { id: string } | null = null
	let nonScoringDriveArray: { teamAbr: string; id: string; phaseQualifier: string }[] = []

	for (const play of playArray) {
		if (play.type === 'Kickoff') {
			previousPlay = null
			continue
		}

		const teamAbr = teamArray.filter((team) => {
			if (team.geniusTeamId === play.teamId) return team.abr
		})[0].abr

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
			nonScoringDriveArray.push({
				teamAbr: teamAbr,
				id: thisDrive.id,
				phaseQualifier: play.phaseQualifier,
			})
			processedDrives.set(driveNumber, thisDrive)
		}

		const down = Number(play.playStartPosition.charAt(0))
			? Number(play.playStartPosition.charAt(0))
			: null

		const distanceMatch = play.playStartPosition.match(/&\s(\d{1,2})(?:\s\w+)?/)
		const distance = distanceMatch ? distanceMatch[1] : null

		const yardLineMatch = play.playStartPosition.match(/(\b[A-Z]{2,3}\s\d{1,2})$/)
		let yardLineInt = null
		if (yardLineMatch) {
			const [playTeamAbr, yardLine] = yardLineMatch[1].split(' ')
			if (playTeamAbr === teamAbr) {
				yardLineInt = -Number(yardLine)
			} else {
				yardLineInt = Number(yardLine)
			}
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
				down: down,
				distance: distance,
				yardLine: yardLineInt,
			},
		})

		if (play.type === 'Run') {
			const rusherMatch = play.description.match(/#\d+\s[A-Z]\.[A-Z][a-z]+(?:\s[A-Z][a-z]+)?/)
			const rusher = rusherMatch ? rusherMatch[0] : null

			const yardsMatch = play.description.match(/(\d+)\s+yard(?:s)?\s+gain/)
			const yardsGained = yardsMatch ? parseInt(yardsMatch[1], 10) : null

			const defenseMatch = play.description.match(/\(#\d+\s[A-Z][a-z]+\.[A-Z][a-z]+\)/)
			const defense = defenseMatch ? defenseMatch[0].slice(1, -1) : null

			const updatedPlay = await playUpdate({
				where: {
					id: createdPlay.id,
				},
				data: {
					rusher,
					defense,
					yardsGained,
				},
			})
		}

		if (play.type === 'Pass') {
			let passer = null
			let receiver = null
			let yardsGained = null
			let defense = null
			let returnYards = null

			const passerMatch = play.description.match(/#\d+\s[A-Z]\.[A-Za-z]+(?:\sJr\.)?/)
			passer = passerMatch ? passerMatch[0] : null

			const receiverMatch = play.description.match(/to\s(#\d+\s[A-Z]\.[A-Za-z]+)/)
			receiver = receiverMatch ? receiverMatch[1] : null

			if (play.subType === 'CompletePass') {
				const yardsMatch = play.description.match(/\b(\d+)\s(?:yards|yard)\b/)
				yardsGained = yardsMatch ? Number(yardsMatch[1]) : null

				const defenderMatch = play.description.match(/\(#\d+\s[A-Z]\.[A-Za-z]+(?:\s[A-Za-z]+)?\)/)
				defense = defenderMatch ? defenderMatch[0].slice(1, -1) : null
			}

			if (play.subType === 'Interception') {
				const interceptionMatch = play.description.match(/intercepted\sby\s(#\d+\s[A-Za-z]+\.[A-Za-z]+)/)
				defense = interceptionMatch ? interceptionMatch[1] : null

				const returnYardsMatch = play.description.match(/return\s(\d+)\syards/)
				returnYards = returnYardsMatch ? Number(returnYardsMatch[1]) : null
			}

			const updatedPlay = await playUpdate({
				where: {
					id: createdPlay.id,
				},
				data: {
					passer,
					receiver,
					defense,
					yardsGained,
					returnYards,
				},
			})
		}

		if (play.type === 'FieldGoal' || play.type === 'Punt') {
			const kickerMatch = play.description.match(/#\d+\s[A-Za-z]+\.[A-Za-z]+/)
			const kicker = kickerMatch ? kickerMatch[0] : null

			let returner = null
			let returnYards = null
			let defense = null
			let puntYardage = null

			if (play.description.includes('NO GOOD') || play.type === 'Punt') {
				const returnerMatch = play.description.match(/#\d+\s[A-Za-z]+\.[A-Za-z]+(?=\sreturn)/)
				returner = returnerMatch ? returnerMatch[0] : null

				const returnYardsMatch = play.description.match(/return\s(\d+)\syards/)
				returnYards = returnYardsMatch ? Number(returnYardsMatch[1]) : null

				const tacklerMatch = play.description.match(/\(#\d+\s[A-Za-z]+\.[A-Za-z]+\)/)
				defense = tacklerMatch ? tacklerMatch[0].replace(/[()]/g, '') : null

				if (play.type === 'Punt') {
					const puntYardageMatch = play.description.match(/punt\s(\d+)\syards/)
					puntYardage = puntYardageMatch ? Number(puntYardageMatch[1]) : null
				}
			}

			const updatedPlay = await playUpdate({
				where: {
					id: createdPlay.id,
				},
				data: {
					kicker,
					defense,
					receiver: returner,
					returnYards: returnYards,
					puntYards: puntYardage,
				},
			})
		}

		if (play.type === 'Sack') {
			let passer = null
			let defense = null

			const passerMatch = play.description.match(/#\d+\s[A-Z]\.[A-Za-z]+(?:\sJr\.)?/)
			passer = passerMatch ? passerMatch[0] : null

			const tacklerMatch = play.description.match(/\(#\d+\s[A-Za-z]+\.[A-Za-z]+\)/)
			defense = tacklerMatch ? tacklerMatch[0].replace(/[()]/g, '') : null

			const updatedPlay = await playUpdate({
				where: {
					id: createdPlay.id,
				},
				data: {
					passer,
					defense,
				},
			})
		}

		if (previousPlay) {
			await playUpdate({
				where: { id: previousPlay.id },
				data: { endPosition: play.playStartPosition },
			})
		}

		if (play.isScoring) {
			const points =
				play.type === 'OnePoint' && play.subType === 'Success'
					? 7
					: play.subType === 'Touchdown'
					? 6
					: play.type === 'FieldGoal' && play.subType === 'Success'
					? 3
					: play.type === 'TwoPoints' && play.subType === 'Success'
					? 8
					: play.subType === 'Single'
					? 1
					: null

			const updatedDrive = await driveUpdate({
				where: {
					id: thisDrive.id,
				},
				data: {
					isScoring: true,
					points: points,
					nextPointOutcome: points,
				},
			})
			nonScoringDriveArray = nonScoringDriveArray.filter((nonScoringDrive) => {
				return nonScoringDrive.id !== updatedDrive.id
			})
			if (nonScoringDriveArray.length > 0) {
				for (let i = 0; i < nonScoringDriveArray.length; i++) {
					const nonScoringDrive = nonScoringDriveArray[i]
					if (
						play.phaseQualifier === '3' &&
						(nonScoringDrive.phaseQualifier === '2' || nonScoringDrive.phaseQualifier === '1')
					) {
						nonScoringDriveArray.splice(i, 1)
						i--
						continue
					}

					const nextPointOutcome = nonScoringDrive.teamAbr === teamAbr ? points : points ? -points : null

					await driveUpdate({
						where: { id: nonScoringDrive.id },
						data: { nextPointOutcome },
					})

					if (play.subType !== 'Touchdown') {
						nonScoringDriveArray.splice(i, 1)
						i--
					}
				}
			}
		}

		previousPlay = createdPlay

		const isLastPlayOfDrive =
			playArray.indexOf(play) === playArray.length - 1 ||
			playArray[playArray.indexOf(play) + 1].id.split('-')[0] !== driveNumber

		if (
			isLastPlayOfDrive &&
			play.type !== 'Punt' &&
			play.subType !== 'Interception' &&
			!(play.type === 'FieldGoal' && play.description.includes('NO GOOD')) &&
			!play.description.includes('fumble')
		) {
			previousPlay = null
		}
	}

	console.log('completed')
}
