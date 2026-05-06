import { afterAll, beforeEach } from 'vitest'
import { disconnectDb, resetDb } from './db'

beforeEach(async () => {
    await resetDb()
})

afterAll(async () => {
    await disconnectDb()
})
