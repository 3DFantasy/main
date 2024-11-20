import puppeteer from 'puppeteer'
import { checkAndUpdateDepthChart } from '../db'

import type { DepthChartObject } from '../../types'

export async function Team4Check() {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	await page.goto(process.env.TEAM_4_URL)

	await page.setViewport({ width: 1080, height: 1024 })

	const result = await page.evaluate(() => {
		const tbodies = document.querySelectorAll('table tbody')
		if (!tbodies.length) return []

		const resultArray: DepthChartObject[] = []

		tbodies.forEach((tbody) => {
			tbody.querySelectorAll('tr').forEach((row) => {
				const cells = row.querySelectorAll('td')

				if (cells.length >= 5) {
					const text = [cells[0].innerText, cells[1].innerText, cells[2].innerText].join(', ')

					const link = cells[4].querySelector('a')
					const href = link ? link.href : null

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
		teamId: 4,
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
