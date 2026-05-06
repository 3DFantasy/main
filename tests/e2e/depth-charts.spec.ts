import { expect, test } from '../helpers/fixtures'

test.describe('depth charts', () => {
    test('authenticated user can load /depth-charts and see team list', async ({
        authenticatedPage,
    }) => {
        await authenticatedPage.goto('/depth-charts')
        // Filter input is unique to this page; safer than role-based selectors that
        // collide with the sidebar nav and breadcrumb "Depth Charts" entries.
        await expect(authenticatedPage.getByPlaceholder('Filter...')).toBeVisible()
    })

    test('filter narrows visible teams', async ({ authenticatedPage }) => {
        await authenticatedPage.goto('/depth-charts')
        const filterInput = authenticatedPage.getByPlaceholder('Filter...')
        await filterInput.fill('zzzzzz-no-match')
        await expect(authenticatedPage.getByText(/no teams match/i)).toBeVisible()
    })

    test('clicking a team navigates to /depth-charts/<uuid>', async ({
        authenticatedPage,
    }) => {
        await authenticatedPage.goto('/depth-charts')
        // Team abbreviations come from TEAM_N_ABBR env vars (T1..T9 in .env.test).
        // Click the T1 link inside the main card (not the sidebar nav).
        const card = authenticatedPage.locator('.team-button', { hasText: /^T1$/ }).first()
        await card.click()
        // UUID is a v4-like string in the URL after navigation.
        await expect(authenticatedPage).toHaveURL(
            /\/depth-charts\/[0-9a-f-]{8,}/
        )
    })

    test('filter resets when navigating between depth-charts pages', async ({
        authenticatedPage,
    }) => {
        await authenticatedPage.goto('/depth-charts')
        const filterInput = authenticatedPage.getByPlaceholder('Filter...')
        await filterInput.fill('T1')

        // Click the T1 team to navigate into it.
        await authenticatedPage
            .locator('.team-button', { hasText: /^T1$/ })
            .first()
            .click()
        await expect(authenticatedPage).toHaveURL(/\/depth-charts\/[0-9a-f-]{8,}/)

        // Filter resets to '' on path change (per the route's useEffect).
        await expect(authenticatedPage.getByPlaceholder('Filter...')).toHaveValue('')
    })
})
