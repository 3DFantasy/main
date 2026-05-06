import { expect, test } from '../helpers/fixtures'
import { createTestAccount } from '../helpers/factories'

test.describe('admin', () => {
    test('admin user can load /admin', async ({ authenticatedPage }) => {
        // The seedDb fixture creates the e2e user with role: 'ADMIN'.
        await authenticatedPage.goto('/admin')
        await expect(authenticatedPage).toHaveURL(/\/admin/)
    })

    test('non-admin user is redirected to /home', async ({ page, seedDb: _seedDb }) => {
        // seedDb already ran (resetting the DB and creating the admin user). Add a USER too.
        await createTestAccount({
            email: 'plain-user@test.local',
            password: 'password123',
            role: 'USER',
        })

        await page.goto('/auth/login')
        await page.getByLabel('Email').fill('plain-user@test.local')
        await page.getByLabel('Password').fill('password123')
        await page.getByRole('button', { name: /sign in/i }).click()
        await expect(page).toHaveURL(/\/home/)

        await page.goto('/admin')
        // Admin loader redirects non-admins to /home; URL should not stick at /admin.
        await expect(page).toHaveURL(/\/home/)
    })
})
