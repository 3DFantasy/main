import { compareDepthChartList } from '~/dao/depthChartList.server'
import { db } from '~/lib/db.server'
import { teamHandlers } from '~/utils/puppeteer/index.server'

import type { DepthChartObject } from '~/types'
import { sendMail } from '~/utils/index.server'
import { getEmailTemplate } from '~/utils/m365/emailTemplate.server'

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

		const notificationField = `team${teamId}Notification` as keyof typeof db.account.fields

		const accountsToMail = await db.account.findMany({
			where: {
				[notificationField]: true,
			},
			select: {
				id: true,
				uuid: true,
				email: true,
			},
		})

		const teamTitle = process.env[`TEAM_${teamId}_TITLE`] as string
		const emailTitle = `New Depth Chart Posted: ${teamTitle}`

		// send email
		const sendMailResp = await sendMail({
			message: {
				subject: `3DF - ${emailTitle}`,
				body: {
					content: getEmailTemplate({
						title: emailTitle,
						depthChartTitle: compareDepthChartListResp.value.newDepthChart.title,
						link: compareDepthChartListResp.value.newDepthChart.href,
						team: teamTitle,
						template: 'newDepthChart',
					}),
					contentType: 'HTML',
				},
				bccRecipients: accountsToMail.map((account) => {
					return {
						emailAddress: {
							address: account.email,
						},
					}
				}),
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
