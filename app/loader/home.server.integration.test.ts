import '../../tests/helpers/integrationSetup'
import { describe, expect, it } from 'vitest'
import { homeLoader } from './home.server'
import { createTestAccount } from '../../tests/helpers/factories'
import { authedRequest } from '../../tests/helpers/session'

describe('homeLoader', () => {
    it('returns the authenticated account when logged in', async () => {
        const { account } = await createTestAccount()
        const req = await authedRequest('http://localhost/home', account)
        const result = await homeLoader(req)
        expect(result.account).toMatchObject({
            id: account.id,
            uuid: account.uuid,
            email: account.email,
        })
        expect(result.nextUrl).toBeNull()
    })

    it('returns null account when no session cookie is present', async () => {
        const result = await homeLoader(new Request('http://localhost/home'))
        expect(result.account).toBeNull()
    })

    it('passes nextUrl through from the query string', async () => {
        const result = await homeLoader(
            new Request('http://localhost/home?nextUrl=/settings')
        )
        expect(result.nextUrl).toBe('/settings')
    })
})
