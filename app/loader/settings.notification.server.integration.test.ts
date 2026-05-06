import '../../tests/helpers/integrationSetup'
import { describe, expect, it } from 'vitest'
import { settingsNotificationLoader } from './settings.notification.server'
import { createTestAccount } from '../../tests/helpers/factories'
import { authedRequest } from '../../tests/helpers/session'

describe('settingsNotificationLoader', () => {
    it('returns 9 team titles for an authenticated user', async () => {
        const { account } = await createTestAccount()
        const req = await authedRequest(
            'http://localhost/settings/notifications',
            account
        )
        const result = await settingsNotificationLoader(req)
        expect(result.teamTitles).toHaveLength(9)
        for (let i = 0; i < 9; i++) {
            expect(result.teamTitles[i].value).toBe(`team${i + 1}`)
        }
    })

    it('throws a redirect Response when unauthenticated', async () => {
        const promise = settingsNotificationLoader(
            new Request('http://localhost/settings/notifications')
        )
        await expect(promise).rejects.toBeInstanceOf(Response)
        try {
            await promise
        } catch (e) {
            if (e instanceof Response) {
                expect(e.headers.get('location')).toBe('/auth/login')
            }
        }
    })
})
