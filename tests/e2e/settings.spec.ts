import { expect, test } from '../helpers/fixtures'

test.describe('settings — page loads', () => {
    test('notification preferences page loads with all 9 team checkboxes', async ({
        authenticatedPage,
    }) => {
        await authenticatedPage.goto('/settings/notifications')
        await expect(
            authenticatedPage.getByRole('heading', {
                name: /email depth chart notifications/i,
            })
        ).toBeVisible()
        const checkboxes = authenticatedPage.getByRole('checkbox')
        await expect(checkboxes).toHaveCount(9)
    })

    test('account settings page loads', async ({ authenticatedPage }) => {
        await authenticatedPage.goto('/settings/account')
        await expect(authenticatedPage.url()).toContain('/settings/account')
    })
})

test.describe('settings — change password', () => {
    test('user can change password and log in with the new one', async ({
        authenticatedPage,
        seedDb,
    }) => {
        const newPassword = 'changed-password-456'

        await authenticatedPage.goto('/settings/account')
        await authenticatedPage.getByLabel('Current Password').fill(seedDb.password)
        await authenticatedPage.getByLabel('New Password', { exact: true }).fill(newPassword)
        await authenticatedPage.getByLabel('Confirm New Password').fill(newPassword)
        await authenticatedPage.getByRole('button', { name: /update/i }).click()
        await expect(authenticatedPage.getByText(/account updated/i)).toBeVisible()

        // Log out and confirm the new password works.
        await authenticatedPage.goto('/auth/logout')
        await authenticatedPage.goto('/auth/login')
        await authenticatedPage.getByLabel('Email').fill(seedDb.email)
        await authenticatedPage.getByLabel('Password').fill(newPassword)
        await authenticatedPage.getByRole('button', { name: /sign in/i }).click()
        await expect(authenticatedPage).toHaveURL(/\/home/)
    })

    test('shows an error toast when current password is wrong', async ({
        authenticatedPage,
    }) => {
        await authenticatedPage.goto('/settings/account')
        await authenticatedPage.getByLabel('Current Password').fill('wrong-current-password')
        await authenticatedPage.getByLabel('New Password', { exact: true }).fill('whatever-new')
        await authenticatedPage.getByLabel('Confirm New Password').fill('whatever-new')
        await authenticatedPage.getByRole('button', { name: /update/i }).click()
        await expect(
            authenticatedPage.getByText(/current password is incorrect/i)
        ).toBeVisible()
    })
})

test.describe('settings — notification preferences persist', () => {
    test('unchecking a team and clicking Update persists across reload', async ({
        authenticatedPage,
    }) => {
        await authenticatedPage.goto('/settings/notifications')

        // Default state: all 9 boxes checked. Uncheck team1 (the first one).
        const checkboxes = authenticatedPage.getByRole('checkbox')
        await expect(checkboxes).toHaveCount(9)
        const firstBox = checkboxes.first()
        await expect(firstBox).toBeChecked()
        await firstBox.uncheck({ force: true })
        await expect(firstBox).not.toBeChecked()

        await authenticatedPage.getByRole('button', { name: /^update$/i }).click()
        await expect(authenticatedPage.getByText(/preferences have been updated/i)).toBeVisible()

        // Reload and confirm team1 is still unchecked.
        await authenticatedPage.reload()
        const reloadedFirst = authenticatedPage.getByRole('checkbox').first()
        await expect(reloadedFirst).not.toBeChecked()
    })
})
