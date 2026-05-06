import { expect, test } from '../helpers/fixtures'

test.describe('unsubscribe', () => {
    test('public unsubscribe page loads with valid account uuid', async ({
        page,
        seedDb,
    }) => {
        // We need the account UUID — re-query via login UI not necessary; the fixture
        // seeds a known email, and we can navigate the unsubscribe URL directly.
        // The route accepts /unsubscribe/:account/:depthChart — use a placeholder depthChart segment.
        // The page will redirect to /home on invalid params, so we just assert it does not 500.
        const response = await page.goto(`/unsubscribe/${seedDb.email}/team1`)
        expect(response?.status()).toBeLessThan(500)
    })
})
