import { PrismaClient } from '@prisma/client'

let client: PrismaClient | undefined

export function getTestDb(): PrismaClient {
    if (!client) {
        client = new PrismaClient({
            datasources: { db: { url: process.env.DATABASE_URL } },
        })
    }
    return client
}

export async function resetDb() {
    const db = getTestDb()
    await db.$transaction([
        db.play.deleteMany(),
        db.drive.deleteMany(),
        db.game.deleteMany(),
        db.depthChart.deleteMany(),
        db.depthChartList.deleteMany(),
        db.team.deleteMany(),
        db.account.deleteMany(),
    ])
}

export async function disconnectDb() {
    if (client) {
        await client.$disconnect()
        client = undefined
    }
}
