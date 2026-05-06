import '../../tests/helpers/integrationSetup'
import { describe, expect, it } from 'vitest'
import { authLoginLoader } from './auth.login.server'
import { authLoginAction } from '../actions/auth.login.server'
import { createTestAccount } from '../../tests/helpers/factories'

function makeRequest(url: string, init?: RequestInit) {
    return new Request(url, init)
}

describe('auth login loader + action', () => {
    it('loader returns nextUrl from query params for unauthenticated visitors', async () => {
        const result = await authLoginLoader(
            makeRequest('http://localhost/auth/login?nextUrl=/settings')
        )
        expect(result).toEqual({ nextUrl: '/settings' })
    })

    it('action returns 402 message on bad credentials', async () => {
        await createTestAccount({ email: 'authtest@test.local', password: 'correct-horse' })
        const formData = new FormData()
        formData.set('email', 'authtest@test.local')
        formData.set('password', 'wrong-password')

        const result = await authLoginAction(
            makeRequest('http://localhost/auth/login', {
                method: 'POST',
                body: formData,
            })
        )
        expect(result).toEqual({
            message: expect.stringMatching(/incorrect/i),
            code: 402,
        })
    })

    it('action throws redirect Response on success', async () => {
        await createTestAccount({ email: 'good@test.local', password: 'correct-horse' })
        const formData = new FormData()
        formData.set('email', 'good@test.local')
        formData.set('password', 'correct-horse')

        await expect(
            authLoginAction(
                makeRequest('http://localhost/auth/login', {
                    method: 'POST',
                    body: formData,
                })
            )
        ).rejects.toBeInstanceOf(Response)
    })
})
