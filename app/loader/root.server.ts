import { sendMail } from '~/utils/index.server'
import { getEmailTemplate } from '~/utils/m365/emailTemplate.server'

export const rootLoader = async (request: Request) => {
	const emailTitle = `New Depth Chart Posted: ${process.env.TEAM_1_TITLE}`

	const sendMailResp = await sendMail({
		message: {
			subject: `3DF - ${emailTitle}`,
			body: {
				content: getEmailTemplate({
					title: emailTitle,
					depthChartTitle: 'DepthChart',
					link: 'google.com',
					team: process.env.TEAM_1_TITLE,
					template: 'newDepthChart',
				}),
				contentType: 'HTML',
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
	// resqueTask({
	// 	job: 'teamCheck',
	// 	teamCheckProps: {
	// 		teamId: 3,
	// 	},
	// })
	// const points: number[] = []

	// const plays = await playFindMany({
	// 	where: {
	// 		type: 'Run',
	// 		down: null,
	// 		isScoring: false,
	// 		startPosition: '',
	// 	},
	// })

	// // const sum = points.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

	// // console.log((sum / plays.length).toFixed(2))

	// // console.log(plays.length)

	// // const games = await gameFindMany({
	// // 	where: {
	// // 		year: 2023,
	// // 	},
	// // })
	// // for (const game of games) {
	// // 	const parsedPlayArray = (await JSON.parse(game.response)) as PXPAPIResponse
	// // 	const parsedPlays = await parsePlays({
	// // 		gameId: game.id,
	// // 		playArray: parsedPlayArray.data.playByPlayInfo.ALL.reverse(),
	// // 	})
	// // }

	return {}
}
