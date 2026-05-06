import { test as base, expect, type Page } from '@playwright/test'
import { disconnectDb, resetDb } from './db'
import { createTestAccount, createTestTeam } from './factories'

type Fixtures = {
    seedDb: { email: string; password: string }
    authenticatedPage: Page
}

export const test = base.extend<Fixtures>({
    // eslint-disable-next-line no-empty-pattern
    seedDb: async ({}, use) => {
        await resetDb()
        for (let i = 1; i <= 9; i++) await createTestTeam(i)
        const { account, plaintextPassword } = await createTestAccount({
            email: 'e2e@test.local',
            password: 'password123',
            role: 'ADMIN',
        })
        await use({ email: account.email, password: plaintextPassword })
        await disconnectDb()
    },
    authenticatedPage: async ({ page, seedDb }, use) => {
        await page.goto('/auth/login')
        await page.getByLabel('Email').fill(seedDb.email)
        await page.getByLabel('Password').fill(seedDb.password)
        await page.getByRole('button', { name: /sign in/i }).click()
        await expect(page).toHaveURL(/\/home/)
        await use(page)
    },
})

export { expect }
