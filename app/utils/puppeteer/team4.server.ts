import puppeteer from 'puppeteer'
import { browserConfig, viewport } from '~/utils/puppeteer/index.server'

import type { DepthChartObject } from '~/types'

export async function team4(): Promise<DepthChartObject[]> {
    const browser = await puppeteer.launch(browserConfig)
    const page = await browser.newPage()

    await page.goto(process.env.TEAM_4_URL)

    await page.setViewport(viewport)

    const result = await page.evaluate(() => {
        const tbodies = document.querySelectorAll('table tbody')
        if (!tbodies.length) return []

        const resultArray: DepthChartObject[] = []

        tbodies.forEach((tbody) => {
            tbody.querySelectorAll('tr').forEach((row) => {
                const cells = row.querySelectorAll('td')

                if (cells.length >= 5) {
                    const text = [
                        cells[0].innerText,
                        cells[1].innerText,
                        cells[2].innerText,
                    ].join(', ')

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

    await browser.close()

    return result
}
