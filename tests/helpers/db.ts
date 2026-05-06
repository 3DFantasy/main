import { PrismaClient } from '@prisma/client'

let client: PrismaClient | undefined

function assertTestDatabase(url: string | undefined): asserts url is string {
    if (!url) {
        throw new Error('DATABASE_URL is not set; refusing to run tests against an unknown database.')
    }
    let dbName: string
    try {
        const parsed = new URL(url)
        dbName = parsed.pathname.replace(/^\//, '').split('?')[0]
    } catch {
        throw new Error(`DATABASE_URL is not a valid URL: ${url}`)
    }
    if (!dbName.endsWith('_test')) {
        throw new Error(
            `Refusing to use database "${dbName}" — its name must end in "_test" to be used by the test suite. ` +
                'Set DATABASE_URL in .env.test to a dedicated test database.'
        )
    }
}

export function getTestDb(): PrismaClient {
    if (!client) {
        assertTestDatabase(process.env.DATABASE_URL)
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
