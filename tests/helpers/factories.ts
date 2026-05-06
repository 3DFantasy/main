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

type DepthChartListOverrides = Partial<{
    teamId: number
    year: number
    value: unknown
}>

export async function createTestDepthChartList(overrides: DepthChartListOverrides = {}) {
    const db = getTestDb()
    const teamId =
        overrides.teamId ?? (await createTestTeam()).id
    return db.depthChartList.create({
        data: {
            teamId,
            year: overrides.year ?? 2026,
            value: JSON.stringify(overrides.value ?? []),
        },
    })
}

type DepthChartOverrides = Partial<{
    teamId: number
    depthChartListId: number
    title: string
    value: string
    year: number
    season: string
    week: number
}>

export async function createTestDepthChart(overrides: DepthChartOverrides = {}) {
    const db = getTestDb()
    let teamId = overrides.teamId
    let depthChartListId = overrides.depthChartListId
    if (!depthChartListId) {
        const list = await createTestDepthChartList(
            teamId ? { teamId } : undefined
        )
        depthChartListId = list.id
        teamId = list.teamId
    }
    return db.depthChart.create({
        data: {
            teamId: teamId!,
            depthChartListId,
            title: overrides.title ?? 'Week 1',
            value: overrides.value ?? 'https://example.com/w1',
            year: overrides.year ?? 2026,
            season: overrides.season ?? 'regular',
            week: overrides.week ?? 1,
        },
    })
}
