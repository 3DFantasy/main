import { db } from '~/lib/db.server'

export type PlayCreateInput = {
	data: {
		gameId: string
		geniusTeamId: string
		number: number
		driveId: string
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
export async function playCreate({ data }: PlayCreateInput): Promise<typeof drive> {
	const drive = await db.play.create({
		data,
		select: {
			id: true,
		},
	})
	return drive
}

export type PlayUpdateInput = {
	where: {
		id: string
	}
	data: {
		gameId?: string
		geniusTeamId?: string
		number?: number
		driveId?: string
		type?: string
		subtype?: string | null
		description?: string
		clock?: string
		timestamp?: number
		phase?: string
		phaseQualifier?: string
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
	}
}
export async function playUpdate({ where, data }: PlayUpdateInput): Promise<typeof drive> {
	const drive = await db.play.update({
		where,
		data,
		select: {
			id: true,
		},
	})
	return drive
}
