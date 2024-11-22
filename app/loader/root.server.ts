import { authenticator } from '~/utils/auth/auth.server'
import { parsePlays } from '~/utils/parse/index.server'
import {
	Team1Check,
	Team2Check,
	Team3Check,
	Team4Check,
	Team5Check,
	Team6Check,
	Team7Check,
	Team8Check,
	Team9Check,
} from '~/utils/puppeteer'
export const rootLoader = async (request: Request) => {
	const account = await authenticator.isAuthenticated(request)

	return { account }
}
