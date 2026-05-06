import { expect, test } from '../helpers/fixtures'

test.describe('settings', () => {
    test('notification preferences page loads with all 9 team checkboxes', async ({
        authenticatedPage,
    }) => {
        await authenticatedPage.goto('/settings/notifications')
        await expect(
            authenticatedPage.getByRole('heading', { name: /email depth chart notifications/i })
        ).toBeVisible()
        const checkboxes = authenticatedPage.getByRole('checkbox')
        await expect(checkboxes).toHaveCount(9)
    })

    test('account settings page loads', async ({ authenticatedPage }) => {
        await authenticatedPage.goto('/settings/account')
        await expect(authenticatedPage.url()).toContain('/settings/account')
    })
})
