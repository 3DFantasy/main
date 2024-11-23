import { db } from '~/lib/db.server'

export type DriveCreateInput = {
	data: {
		gameId: string
		geniusTeamId: string
		number: number
	}
}

export async function driveCreate({ data }: DriveCreateInput): Promise<typeof drive> {
	const drive = await db.drive.create({
		data,
		select: {
			id: true,
		},
	})
	return drive
}

export type DriveUpdateInput = {
	where: {
		id: string
	}
	data: {
		gameId?: string
		geniusTeamId?: string
		number?: number
		isScoring?: boolean
		points?: number | null
	}
}

export async function driveUpdate({ where, data }: DriveUpdateInput): Promise<typeof drive> {
	const drive = await db.drive.update({
		where: where,
		data: data,
		select: {
			id: true,
		},
	})
	return drive
}
