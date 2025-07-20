import puppeteer from 'puppeteer'
import { browserConfig, viewport } from '~/utils/puppeteer/index.server'

import type { DepthChartObject } from '~/types'

export async function team9(): Promise<DepthChartObject[]> {
	const browser = await puppeteer.launch(browserConfig)
	const page = await browser.newPage()

	await page.goto(process.env.TEAM_9_URL)
	await page.setViewport(viewport)

	// Extract data from the new card-based layout
	const result = await page.evaluate(() => {
		// Select all card elements
		const cards = document.querySelectorAll('.redblacks-primary-card')
		if (!cards.length) return []

		// Initialize array to store results
		const resultArray: DepthChartObject[] = []

		// Loop through each card and extract data
		cards.forEach((card) => {
			// Get the h3 text (game type)
			const h3Text = card.querySelector('h3')?.textContent?.trim() || ''

			// Get the date/time text
			const dateText =
				card.querySelector('.redblacks-primary-card-content > p:first-of-type')?.textContent?.trim() ||
				''

			// Get the teams text
			const teamsText =
				card.querySelector('.redblacks-primary-card-content > p:last-of-type')?.textContent?.trim() || ''

			// Get the href from the download link - use getAttribute to get the raw value
			const link = card.querySelector('a')
			const href = link?.getAttribute('href') || ''

			// Only add to results if href is not "#" and not empty
			if (href && href !== '#' && !href.endsWith('#')) {
				// Combine the texts for the title
				const title = `${h3Text}, ${dateText}, ${teamsText}`.replace(/\s+/g, ' ').trim()

				resultArray.push({
					title: title,
					href: href.startsWith('http')
						? href
						: `https://www.ottawaredblacks.com${href.startsWith('/') ? '' : '/'}${href}`,
				})
			}
		})

		return resultArray
	})

	await browser.close()
	return result
}
