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
})
