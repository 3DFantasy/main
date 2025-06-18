import puppeteer from 'puppeteer'
import { viewport } from '~/utils/puppeteer/index.server'

import type { DepthChartObject } from '~/types'

export async function team7(): Promise<DepthChartObject[]> {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	await page.goto(process.env.TEAM_7_URL)

	await page.setViewport(viewport)

	const result = await page.evaluate(() => {
		const tables = document.querySelectorAll('table')
		const resultArray: DepthChartObject[] = []

		for (const table of tables) {
			const headerText = table.querySelector('thead')?.textContent || ''

			// Skip 2024 table
			if (headerText.includes('HAM Depth') || headerText.includes('OPP Depth')) {
				continue
			}

			// Get tbody from THIS table only
			const tbody = table.querySelector('tbody')
			if (!tbody) continue

			tbody.querySelectorAll('tr').forEach((row) => {
				const cells = row.querySelectorAll('td')

				if (cells.length >= 5 && cells[4]) {
					// Get the text from the "Depth & Roster" cell with null check
					const depthRosterText = cells[4].textContent?.trim() || ''

					// Get the link from the "Depth & Roster" cell
					const link = cells[4].querySelector('a')
					const href = link ? link.href : null

					// Only add if there's a link and it contains specific keywords
					if (href && href.includes('.pdf') && (href.includes('Depth') || href.includes('Roster'))) {
						resultArray.push({
							title: `${cells[0]?.innerText || ''}, ${cells[1]?.innerText || ''}, ${
								cells[2]?.innerText || ''
							} - ${depthRosterText}`,
							href: href,
						})
					}
				}
			})
		}

		return resultArray
	})

	await browser.close()

	return result
}

// 2024
// const result = await page.evaluate(() => {
// 	const tbodies = document.querySelectorAll('table tbody')
// 	if (!tbodies.length) return []

// 	const resultArray: DepthChartObject[] = []

// 	tbodies.forEach((tbody) => {
// 		tbody.querySelectorAll('tr').forEach((row) => {
// 			const cells = row.querySelectorAll('td')

// 			// Ensure there are at least four columns in the row
// 			if (cells.length >= 4) {
// 				// Get the text from the first column
// 				const text = cells[0].innerText

// 				// Get the href from the fourth column
// 				const link = cells[3].querySelector('a')
// 				const href = link ? link.href : null

// 				// Add the result to the array only if a valid href is found
// 				if (href) {
// 					resultArray.push({
// 						title: text,
// 						href: href,
// 					})
// 				}
// 			}
// 		})
// 	})
// 	return resultArray
// })
