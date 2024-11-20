import puppeteer from 'puppeteer'
import { checkAndUpdateDepthChart, saveAllDepthCharts } from '~/utils/db/index.server'

import type { DepthChartObject } from '~/types'
import { depthChartCreate } from '~/dao'
import { depthChartListCreate } from '~/dao/depthChartList.server'

export async function Team1Check() {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	await page.goto(process.env.TEAM_1_URL)

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

	await saveAllDepthCharts({ result, teamId: 1, year: 2024 })

	// // compare w db

	// if (updateDepthChartResp.value.code === 200) {
	// 	// trigger email
	// }

	return {}
}
