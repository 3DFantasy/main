import { db } from '~/lib/db.server'

export type DriveCreateInput = {
    data: {
        gameId: number
        geniusTeamId: string
        number: number
    }
}

export async function driveCreate({
    data,
}: DriveCreateInput): Promise<typeof drive> {
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
        id: number
    }
    data: {
        gameId?: number
        geniusTeamId?: string
        number?: number
        isScoring?: boolean
        points?: number | null
        nextPointOutcome?: number | null
    }
}

export async function driveUpdate({
    where,
    data,
}: DriveUpdateInput): Promise<typeof drive> {
    const drive = await db.drive.update({
        where: where,
        data: data,
        select: {
            id: true,
        },
    })
    return drive
}

export type DriveFindUniqueInput = {
    where: {
        id: number
    }
}

export async function driveFindUnique({
    where,
}: DriveFindUniqueInput): Promise<typeof drive> {
    const drive = await db.drive.findUnique({
        where: where,
    })
    return drive
}
