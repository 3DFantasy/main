import puppeteer from 'puppeteer'
import { checkAndUpdateDepthChart } from '../db'

import type { DepthChartObject } from '../../types'

export async function Team7Check() {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	await page.goto(process.env.TEAM_7_URL)

	await page.setViewport({ width: 1080, height: 1024 })

	const result = await page.evaluate(() => {
		const tbodies = document.querySelectorAll('table tbody')
		if (!tbodies.length) return []

		const resultArray: DepthChartObject[] = []

		tbodies.forEach((tbody) => {
			tbody.querySelectorAll('tr').forEach((row) => {
				const cells = row.querySelectorAll('td')

				// Ensure there are at least four columns in the row
				if (cells.length >= 4) {
					// Get the text from the first column
					const text = cells[0].innerText

					// Get the href from the fourth column
					const link = cells[3].querySelector('a')
					const href = link ? link.href : null

					// Add the result to the array only if a valid href is found
					if (href) {
						resultArray.push({
							title: text,
							href: href,
						})
					}
				}
			})
		})
		return resultArray
	})

	// compare w db
	const updateDepthChartResp = await checkAndUpdateDepthChart({
		depthChart: result,
		teamId: 7,
		year: 2024,
	})

	if (updateDepthChartResp.isErr) {
		return updateDepthChartResp.error
	}

	if (updateDepthChartResp.value.code === 200) {
		// trigger email
	}

	await browser.close()
	return true
}
