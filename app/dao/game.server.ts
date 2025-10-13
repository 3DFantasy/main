import { db } from '~/lib/db.server'

export type GameCreateInput = {
    data: {
        id: string
        response: string
        year: number
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

export type GameFindManyInput = {
    where: {
        year?: number
        id?: string
    }
}

export async function gameFindMany({
    where,
}: GameFindManyInput): Promise<typeof games> {
    const games = await db.game.findMany({
        where,
        select: {
            id: true,
            response: true,
        },
    })
    return games
}
