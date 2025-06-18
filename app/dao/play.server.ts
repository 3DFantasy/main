import { db } from '~/lib/db.server'

export type PlayCreateInput = {
	data: {
		gameId: number
		geniusTeamId: string
		number: number
		driveId: number
		type: string
		subtype: string | null
		description: string
		clock: string
		timestamp: number
		phase: string
		phaseQualifier: string
		isScoring: boolean
		startPosition: string
		endPosition?: string | null
		down?: number | null
		distance?: string | null
		yardLine?: number | null
		yardsGained?: number | null
		kicker?: string | null
		passer?: string | null
		rusher?: string | null
		receiver?: string | null
		returnYards?: number | null
		puntYards?: number | null
		defense?: string | null
		epa?: number | null
	}
}
export async function playCreate({ data }: PlayCreateInput): Promise<typeof play> {
	const play = await db.play.create({
		data,
		select: {
			id: true,
		},
	})
	return play
}

export type PlayUpdateInput = {
	where: {
		id: number
	}
	data: {
		gameId?: number
		geniusTeamId?: string
		number?: number
		driveId?: number
		type?: string
		subtype?: string | null
		description?: string
		clock?: string
		timestamp?: number
		phase?: string
		phaseQualifier?: string
		down?: number | null
		distance?: string | null
		isScoring?: boolean
		startPosition?: string
		endPosition?: string
		kicker?: string | null
		passer?: string | null
		rusher?: string | null
		receiver?: string | null
		defense?: string | null
		returnYards?: number | null
		puntYards?: number | null
		epa?: number | null
		yardsGained?: number | null
		yardLine?: number | null
	}
}

export async function playUpdate({ where, data }: PlayUpdateInput): Promise<typeof play> {
	const play = await db.play.update({
		where,
		data,
		select: {
			id: true,
		},
	})
	return play
}

export type PlayFindManyInput = {
	where: {
		type?: 'Run'
		subtype?: string | null
		isScoring?: boolean
		startPosition?: string
		down?: number | null
		distance?: string
		yardLine?: number | number[]
	}
}

export async function playFindMany({ where }: PlayFindManyInput): Promise<typeof play> {
	const { yardLine, ...otherConditions } = where

	const play = await db.play.findMany({
		where: {
			...otherConditions,
			yardLine: Array.isArray(yardLine) ? { in: yardLine } : yardLine,
		},
		select: {
			id: true,
			number: true,
			description: true,
			yardsGained: true,
			geniusTeamId: true,
			Drive: {
				select: {
					id: true,
					nextPointOutcome: true,
				},
			},
		},
	})
	return play
}

export type PlayFindUniqueInput = {
	where: {
		driveId: number
		number: number
	}
}

export async function playFindUnique({ where }: PlayFindUniqueInput): Promise<typeof play> {
	const play = await db.play.findMany({
		where,
		select: {
			id: true,
			number: true,
			description: true,
			startPosition: true,
			yardsGained: true,
			endPosition: true,
			Drive: {
				select: {
					id: true,
					nextPointOutcome: true,
				},
			},
		},
	})
	return play
}
