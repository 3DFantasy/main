import '../../../../tests/helpers/integrationSetup'
import { describe, expect, it } from 'vitest'
import { parseApiCreateAccountAction } from './api.createAccount.server'
import { createTestAccount } from '../../../../tests/helpers/factories'

function fd(values: Record<string, string>): FormData {
    const f = new FormData()
    for (const [k, v] of Object.entries(values)) f.set(k, v)
    return f
}

describe('parseApiCreateAccountAction', () => {
    it('returns ok for a new email', async () => {
        const result = await parseApiCreateAccountAction({
            formData: fd({ email: 'new@test.local' }),
        })
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value.email).toBe('new@test.local')
    })

    it('rejects an existing email', async () => {
        await createTestAccount({ email: 'taken@test.local' })
        const result = await parseApiCreateAccountAction({
            formData: fd({ email: 'taken@test.local' }),
        })
        expect(result.isErr).toBe(true)
        if (result.isErr) {
            expect(result.error.message).toMatch(/already exists/i)
            expect(result.error.code).toBe(401)
        }
    })

    it('rejects an invalid email format', async () => {
        const result = await parseApiCreateAccountAction({
            formData: fd({ email: 'not-an-email' }),
        })
        expect(result.isErr).toBe(true)
        if (result.isErr) expect(result.error.message).toMatch(/not a valid email/i)
    })

    it('rejects an empty email', async () => {
        const result = await parseApiCreateAccountAction({
            formData: fd({ email: '' }),
        })
        expect(result.isErr).toBe(true)
    })
})
