import puppeteer from 'puppeteer'
import { browserConfig, viewport } from '~/utils/puppeteer/index.server'

import type { DepthChartObject } from '~/types'

export async function team1(): Promise<DepthChartObject[]> {
	const browser = await puppeteer.launch(browserConfig)
	const page = await browser.newPage()

	await page.goto(process.env.TEAM_1_URL)

	await page.setViewport(viewport)

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

	return result
}
