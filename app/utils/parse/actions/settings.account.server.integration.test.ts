import '../../../../tests/helpers/integrationSetup'
import bcrypt from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { parseSettingsAccountAction } from './settings.account.server'
import { createTestAccount } from '../../../../tests/helpers/factories'

function fd(values: Record<string, string>): FormData {
    const f = new FormData()
    for (const [k, v] of Object.entries(values)) f.set(k, v)
    return f
}

describe('parseSettingsAccountAction', () => {
    it('returns ok with a hashed new password on the happy path', async () => {
        const { account, plaintextPassword } = await createTestAccount({
            email: 'pw-change@test.local',
        })
        const result = await parseSettingsAccountAction({
            formData: fd({
                email: account.email,
                currentPassword: plaintextPassword,
                newPassword: 'newPassword456',
                newPasswordConfirm: 'newPassword456',
            }),
        })
        expect(result.isOk).toBe(true)
        if (!result.isOk) return
        expect(result.value.email).toBe(account.email)
        expect(bcrypt.compareSync('newPassword456', result.value.newPasswordHash)).toBe(true)
    })

    it('rejects when the current password is wrong', async () => {
        const { account } = await createTestAccount({
            email: 'wrong-pw@test.local',
            password: 'realPassword',
        })
        const result = await parseSettingsAccountAction({
            formData: fd({
                email: account.email,
                currentPassword: 'wrongPassword',
                newPassword: 'newPassword456',
                newPasswordConfirm: 'newPassword456',
            }),
        })
        expect(result.isErr).toBe(true)
        if (result.isErr) {
            expect(result.error.message).toMatch(/current password is incorrect/i)
            expect(result.error.code).toBe(401)
        }
    })

    it('rejects when the email does not match an account', async () => {
        const result = await parseSettingsAccountAction({
            formData: fd({
                email: 'nobody@test.local',
                currentPassword: 'whatever',
                newPassword: 'newPassword456',
                newPasswordConfirm: 'newPassword456',
            }),
        })
        expect(result.isErr).toBe(true)
        if (result.isErr) expect(result.error.message).toMatch(/account does not exist/i)
    })

    it('rejects when newPassword does not match newPasswordConfirm', async () => {
        const { account, plaintextPassword } = await createTestAccount()
        const result = await parseSettingsAccountAction({
            formData: fd({
                email: account.email,
                currentPassword: plaintextPassword,
                newPassword: 'aaaaaaaa',
                newPasswordConfirm: 'bbbbbbbb',
            }),
        })
        expect(result.isErr).toBe(true)
        if (result.isErr) expect(result.error.message).toMatch(/do not match/i)
    })

    it('rejects when any password field is empty', async () => {
        const { account, plaintextPassword } = await createTestAccount()
        const result = await parseSettingsAccountAction({
            formData: fd({
                email: account.email,
                currentPassword: plaintextPassword,
                newPassword: '',
                newPasswordConfirm: '',
            }),
        })
        expect(result.isErr).toBe(true)
        if (result.isErr) expect(result.error.message).toMatch(/cannot be blank/i)
    })
})
