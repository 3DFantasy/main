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
