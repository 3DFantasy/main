import '../../tests/helpers/integrationSetup'
import { describe, expect, it } from 'vitest'
import { unsubscribeAction } from './unsubscribe.server'
import { createTestAccount } from '../../tests/helpers/factories'
import { getTestDb } from '../../tests/helpers/db'

function makeRequest(body: Record<string, string>): Request {
    const fd = new FormData()
    for (const [k, v] of Object.entries(body)) fd.set(k, v)
    return new Request('http://localhost/api/unsubscribe', {
        method: 'POST',
        body: fd,
    })
}

function fullPayload(accountId: number, overrides: Record<string, string> = {}) {
    const body: Record<string, string> = { accountId: String(accountId) }
    for (let i = 1; i <= 9; i++) body[`team${i}`] = 'true'
    return { ...body, ...overrides }
}

describe('unsubscribeAction', () => {
    it('updates all 9 notification flags on the row and returns the updated account', async () => {
        const { account } = await createTestAccount()
        const result = await unsubscribeAction(
            makeRequest(
                fullPayload(account.id, {
                    team1: 'false',
                    team5: 'false',
                    team9: 'false',
                })
            )
        )
        expect('account' in result && result.account).toBeTruthy()
        if (!('account' in result) || !result.account) return
        const updated = result.account
        expect(updated.team1Notification).toBe(false)
        expect(updated.team2Notification).toBe(true)
        expect(updated.team5Notification).toBe(false)
        expect(updated.team9Notification).toBe(false)

        const reread = await getTestDb().account.findUnique({
            where: { id: account.id },
        })
        expect(reread!.team1Notification).toBe(false)
        expect(reread!.team5Notification).toBe(false)
    })

    it('returns an error when accountId is missing', async () => {
        const result = await unsubscribeAction(
            makeRequest(
                Object.fromEntries(
                    Array.from({ length: 9 }, (_, i) => [`team${i + 1}`, 'false'])
                )
            )
        )
        expect('account' in result).toBe(false)
        expect(result).toMatchObject({ code: 400 })
    })

    it('returns an error when a flag is malformed', async () => {
        const { account } = await createTestAccount()
        const result = await unsubscribeAction(
            makeRequest(fullPayload(account.id, { team3: 'maybe' }))
        )
        expect('account' in result).toBe(false)
        expect(result).toMatchObject({ code: 500 })
    })
})
