import puppeteer from 'puppeteer'
import { checkAndUpdateDepthChart } from '../db'

import type { DepthChartObject } from '../../types'

export async function Team8Check() {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	await page.goto(process.env.TEAM_8_URL)

	await page.setViewport({ width: 1080, height: 1024 })

	const result = await page.evaluate(() => {
		const tbodies = document.querySelectorAll('table tbody')
		if (!tbodies.length) return []

		const resultArray: DepthChartObject[] = []

		tbodies.forEach((tbody) => {
			tbody.querySelectorAll('td').forEach((td, index, tds) => {
				const link = td.querySelector('a')
				if (link && link.href) {
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

	// compare w db
	const updateDepthChartResp = await checkAndUpdateDepthChart({
		depthChart: result,
		teamId: 8,
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
