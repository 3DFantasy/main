import { gameCreate } from '~/dao/index.server'
import { PXPAPIResponse } from '~/types'
import { logger } from '~/utils/logger'
import { timeout } from '../timeout'

export type FetchAPIPXPInput = {
	gameIDs: string[]
	year: number
}

export async function fetchAPIPXP({ gameIDs, year }: FetchAPIPXPInput) {
	const url = process.env.PXP_API_URL
	const fetchResp = await Promise.all(
		gameIDs.map(async (gameID) => {
			const resp = await fetch(url + gameID, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(async (result) => {
				const resp = (await result.json()) as PXPAPIResponse

				const game = await gameCreate({
					data: {
						id: gameID,
						response: JSON.stringify(resp),
						year,
					},
				})

				if (!game) {
					return `Something went wrong creating: ${gameID}`
				} else {
					return `${gameID} ✔`
				}
			})
			await timeout(5)
			logger.info(resp)
		})
	)
	logger.info(`fetchAPIPXP complete: ${fetchResp}`)
}
