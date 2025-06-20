import { compareDepthChartList } from '~/dao/depthChartList.server'
import { db } from '~/lib/db.server'
import { teamHandlers } from '~/utils/puppeteer/index.server'

import type { DepthChartObject } from '~/types'
import { sendMail } from '~/utils/index.server'

export async function teamCheck({ teamId }: { teamId: number }) {
	const year = Number(process.env.LEAGUE_YEAR)

	let result: DepthChartObject[] | null = null
	if (teamHandlers[teamId as keyof typeof teamHandlers]) {
		result = await teamHandlers[teamId as keyof typeof teamHandlers]()
	}

	if (!result) {
		throw new Error(`Something went wrong fetching depth charts for teamId: ${teamId}`)
	}

	const compareDepthChartListResp = await compareDepthChartList({
		teamId,
		year,
		value: result,
	})

	if (compareDepthChartListResp.isErr) {
		throw new Error(compareDepthChartListResp.error.message)
	}

	if (compareDepthChartListResp.value.newDepthChart) {
		// create new chart
		await db.depthChart.create({
			data: {
				teamId,
				title: compareDepthChartListResp.value.newDepthChart.title,
				value: compareDepthChartListResp.value.newDepthChart.href,
				year,
			},
		})

		// update existing list
		await db.depthChartList.update({
			where: {
				id: compareDepthChartListResp.value.depthChartList.id,
			},
			data: {
				value: JSON.stringify(result),
			},
		})

		// send email
		const sendMailResp = await sendMail({
			message: {
				subject: 'Test email',
				body: {
					content: 'Test email from 3df',
					contentType: 'Text',
				},
				toRecipients: [
					{
						emailAddress: {
							address: 'wilsonbirch@gmail.com',
						},
					},
				],
			},
			saveToSentItems: 'true',
		})
		if (sendMailResp.isErr) {
			throw new Error(sendMailResp.error.message)
		}
	}

	console.log(`Team${teamId}Check complete`)
	return true
}
