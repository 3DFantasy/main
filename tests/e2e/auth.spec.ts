import { expect, test } from '../helpers/fixtures'

function uniqueEmail(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@test.local`
}

test.describe('login', () => {
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

    test('preserves nextUrl on successful login', async ({ page, seedDb }) => {
        await page.goto('/auth/login?nextUrl=/settings')
        await page.getByLabel('Email').fill(seedDb.email)
        await page.getByLabel('Password').fill(seedDb.password)
        await page.getByRole('button', { name: /sign in/i }).click()
        await expect(page).toHaveURL(/\/settings/)
    })
})

test.describe('signup', () => {
    test('creates a new account and redirects to /home', async ({ page, seedDb: _seedDb }) => {
        const email = uniqueEmail('signup-success')
        const password = 'password123'

        await page.goto('/auth/signup')
        const form = page.locator('form')
        await form.getByLabel('Email').fill(email)
        await form.getByLabel('Password', { exact: true }).fill(password)
        await form.getByLabel('Confirm Password').fill(password)
        await form.getByRole('button', { name: /sign up/i }).click()

        await expect(page).toHaveURL(/\/home/)
    })

    test('rejects an email that already exists', async ({ page, seedDb }) => {
        await page.goto('/auth/signup')
        const form = page.locator('form')
        await form.getByLabel('Email').fill(seedDb.email)
        await form.getByLabel('Password', { exact: true }).fill('password123')
        await form.getByLabel('Confirm Password').fill('password123')
        await form.getByRole('button', { name: /sign up/i }).click()

        await expect(page.getByText(/already exists/i)).toBeVisible()
        await expect(page).toHaveURL(/\/auth\/signup/)
    })

    test('rejects passwords shorter than 8 characters', async ({ page, seedDb: _seedDb }) => {
        await page.goto('/auth/signup')
        const form = page.locator('form')
        await form.getByLabel('Email').fill(uniqueEmail('signup-short-pw'))
        await form.getByLabel('Password', { exact: true }).fill('short')
        await form.getByLabel('Confirm Password').fill('short')
        await form.getByRole('button', { name: /sign up/i }).click()

        await expect(page.getByText(/8 characters/i)).toBeVisible()
        await expect(page).toHaveURL(/\/auth\/signup/)
    })

    test('disables the submit button when password and confirm do not match', async ({
        page,
        seedDb: _seedDb,
    }) => {
        await page.goto('/auth/signup')
        const form = page.locator('form')
        await form.getByLabel('Email').fill(uniqueEmail('mismatch'))
        await form.getByLabel('Password', { exact: true }).fill('password123')
        await form.getByLabel('Confirm Password').fill('differentpw')

        await expect(form.getByRole('button', { name: /sign up/i })).toBeDisabled()
    })
})

test.describe('logout', () => {
    test('logs out and redirects away from /home', async ({ authenticatedPage }) => {
        await authenticatedPage.goto('/auth/logout')
        await expect(authenticatedPage).toHaveURL(/\/auth\/login|\/$/)
    })
})
