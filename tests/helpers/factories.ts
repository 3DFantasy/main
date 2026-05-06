import bcrypt from 'bcryptjs'
import { getTestDb } from './db'

type AccountOverrides = Partial<{
    email: string
    password: string
    role: 'USER' | 'ADMIN'
}>

export async function createTestAccount(overrides: AccountOverrides = {}) {
    const db = getTestDb()
    const password = overrides.password ?? 'password123'
    const passwordHash = bcrypt.hashSync(password, 10)
    const account = await db.account.create({
        data: {
            email: overrides.email ?? `user-${Date.now()}-${Math.random()}@test.local`,
            password: passwordHash,
            role: overrides.role ?? 'USER',
        },
    })
    return { account, plaintextPassword: password }
}

export async function createTestTeam(id?: number) {
    const db = getTestDb()
    return db.team.create({
        data: id ? { id, geniusTeamId: `team-${id}` } : { geniusTeamId: `team-${Date.now()}` },
    })
}
