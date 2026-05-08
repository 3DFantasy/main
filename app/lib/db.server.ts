import { PrismaClient } from '@prisma/client'

let db: PrismaClient
declare global {
    var __db: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
    db = new PrismaClient()
    db.$connect()
} else if (process.env.NODE_ENV === 'test') {
    // Test runs against a real Postgres test DB; DATABASE_URL is set via .env.test.
    db = new PrismaClient()
} else {
    if (!global.__db) {
        global.__db = new PrismaClient()
        global.__db.$connect()
    }
    db = global.__db
}

export * from '@prisma/client'
export { db }
