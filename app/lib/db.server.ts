import { PrismaClient } from '@prisma/client'

let db: PrismaClient
declare global {
	var __db: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
	db = new PrismaClient()
	db.$connect()
} else if (process.env.NODE_ENV === 'test' || process.env.CI) {
	// Skip connecting to the database in the test environment or GitHub Actions
	db = new PrismaClient({
		datasources: {
			db: {
				url: 'file:./test.db', // Use an in-memory SQLite database for testing
			},
		},
	})
} else {
	if (!global.__db) {
		global.__db = new PrismaClient()
		global.__db.$connect()
	}
	db = global.__db
}

export * from '@prisma/client'
export { db }
