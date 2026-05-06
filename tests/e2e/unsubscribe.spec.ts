import { expect, test } from '../helpers/fixtures'

test.describe('unsubscribe', () => {
    test('redirects to /home when the account param is not a valid uuid', async ({
        page,
        seedDb: _seedDb,
    }) => {
        // The loader rejects non-UUID account params, returns a message+code,
        // and the component navigates to /home in response.
        await page.goto('/unsubscribe/not-a-uuid/team1')
        await expect(page).toHaveURL(/\/home|\/auth\/login/)
    })
})
