import { expect, test } from '../helpers/fixtures'

test.describe('auth', () => {
    test('logs in successfully with valid credentials', async ({ page, seedDb }) => {
        await page.goto('/auth/login')
        await page.getByLabel('Email').fill(seedDb.email)
        await page.getByLabel('Password').fill(seedDb.password)
        await page.getByRole('button', { name: /sign in/i }).click()
        await expect(page).toHaveURL(/\/home/)
    })

    test('rejects invalid credentials with a toast', async ({ page, seedDb }) => {
        await page.goto('/auth/login')
        await page.getByLabel('Email').fill(seedDb.email)
        await page.getByLabel('Password').fill('wrong-password')
        await page.getByRole('button', { name: /sign in/i }).click()
        await expect(page.getByText(/incorrect credentials/i)).toBeVisible()
        await expect(page).toHaveURL(/\/auth\/login/)
    })

    test('logs out and redirects to login', async ({ authenticatedPage }) => {
        await authenticatedPage.goto('/auth/logout')
        await expect(authenticatedPage).toHaveURL(/\/auth\/login|\/$/)
    })
})
