import '../../tests/helpers/integrationSetup'
import { describe, expect, it } from 'vitest'
import { authSignupAction } from './auth.signup.server'
import { createTestAccount } from '../../tests/helpers/factories'
import { getTestDb } from '../../tests/helpers/db'

function makeRequest(body: Record<string, string>, search = ''): Request {
    const fd = new FormData()
    for (const [k, v] of Object.entries(body)) fd.set(k, v)
    return new Request(`http://localhost/auth/signup${search}`, {
        method: 'POST',
        body: fd,
    })
}

describe('authSignupAction', () => {
    it('throws a redirect Response and creates the account on success', async () => {
        const promise = authSignupAction(
            makeRequest({ email: 'fresh@test.local', password: 'password123' })
        )
        await expect(promise).rejects.toBeInstanceOf(Response)

        const account = await getTestDb().account.findUnique({
            where: { email: 'fresh@test.local' },
        })
        expect(account).not.toBeNull()
    })

    it('returns 402 when the email is already taken', async () => {
        await createTestAccount({ email: 'dupe@test.local' })
        const result = await authSignupAction(
            makeRequest({ email: 'dupe@test.local', password: 'password123' })
        )
        expect(result).toMatchObject({
            message: expect.stringMatching(/already exists/i),
            code: 402,
        })
    })

    it('returns 402 when the email is not a valid format', async () => {
        const result = await authSignupAction(
            makeRequest({ email: 'not-an-email', password: 'password123' })
        )
        expect(result).toMatchObject({
            message: expect.stringMatching(/not a valid email/i),
            code: 402,
        })
    })

    it('returns 402 when the password is shorter than 8 chars', async () => {
        const result = await authSignupAction(
            makeRequest({ email: 'short-pw@test.local', password: 'short' })
        )
        expect(result).toMatchObject({
            message: expect.stringMatching(/8 characters/i),
            code: 402,
        })
    })

    it('preserves nextUrl in the success redirect', async () => {
        let response: Response | undefined
        try {
            await authSignupAction(
                makeRequest(
                    { email: 'nexturl@test.local', password: 'password123' },
                    '?nextUrl=/settings'
                )
            )
        } catch (e) {
            if (e instanceof Response) response = e
        }
        expect(response).toBeDefined()
        expect(response!.headers.get('location')).toBe('/home?nextUrl=/settings')
    })
})
