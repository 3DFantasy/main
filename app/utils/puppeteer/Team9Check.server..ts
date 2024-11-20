import puppeteer from 'puppeteer'
import { saveAllDepthCharts } from '~/utils/index.server'

import type { DepthChartObject } from '~/types'

export async function Team9Check() {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	await page.goto(process.env.TEAM_9_URL)

	await page.setViewport({ width: 1080, height: 1024 })

	// Extract hrefs from <td> tags with <a> elements
	const result = await page.evaluate(() => {
		// Select all <tbody> elements in the document
		const tbodies = document.querySelectorAll('table tbody')
		if (!tbodies.length) return []

		// Initialize an array to store all hrefs
		const resultArray: DepthChartObject[] = []

		// Loop through each <tbody> and collect hrefs
		tbodies.forEach((tbody) => {
			tbody.querySelectorAll('td').forEach((td, index, tds) => {
				const link = td.querySelector('a')
				if (link && link.href) {
					// Check for three preceding <td> elements
					if (index >= 3) {
						const precedingText = [
							tds[index - 3].innerText,
							tds[index - 2].innerText,
							tds[index - 1].innerText,
						].join(', ')

						// Push the combined string and href as an object
						resultArray.push({
							title: precedingText,
							href: link.href,
						})
					}
				}
			})
		})
		return resultArray
	})

	await browser.close()

	await saveAllDepthCharts({ result, teamId: 9, year: 2024 })

	return true
}
