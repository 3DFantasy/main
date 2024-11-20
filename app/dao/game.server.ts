import { db } from '~/lib/db.server'

export type GameCreateInput = {
	data: {
		id: string
		response: string
	}
}

export async function gameCreate({
	data,
}: // where,
GameCreateInput): Promise<typeof game> {
	const game = await db.game.create({
		data: data,
		select: {
			id: true,
			response: true,
			createdAt: true,
			updatedAt: true,
		},
	})
	return game
}
