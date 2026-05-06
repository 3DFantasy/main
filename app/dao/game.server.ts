import { db } from '~/lib/db.server'

export type GameCreateInput = {
    data: {
        geniusGameId: string
        response: string
        year: number
    }
}

export async function gameCreate({
    data,
}: GameCreateInput): Promise<typeof game> {
    const game = await db.game.create({
        data: data,
        select: {
            id: true,
            uuid: true,
            geniusGameId: true,
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
        geniusGameId?: string
    }
}

export async function gameFindMany({
    where,
}: GameFindManyInput): Promise<typeof games> {
    const games = await db.game.findMany({
        where,
        select: {
            id: true,
            uuid: true,
            geniusGameId: true,
            response: true,
        },
    })
    return games
}
