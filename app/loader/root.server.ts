import { authenticator } from '~/utils/auth/auth.server'
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

	// await Team1Check()
	// await Team2Check()
	// await Team3Check()
	// await Team4Check()
	// await Team5Check()
	// await Team6Check()
	// await Team7Check()
	// await Team8Check()
	// await Team9Check()

	// const account = await authenticator.isAuthenticated(request)

	// if (process.env.NODE_ENV === 'production') {
	// 	Sentry.init({
	// 		dsn: 'https://2ae74cd8a9a52e50f235f899ea38b40a@o4506779371700224.ingest.us.sentry.io/4506779371831296',
	// 		tracesSampleRate: 1,
	// 		integrations: [new Sentry.Integrations.Prisma({ client: prisma })],
	// 		enabled: true,
	// 	})
	// 	Sentry.setTag('application', process.env.SENTRY_APP_SERVER_TAG)
	// }

	return { account }
}
