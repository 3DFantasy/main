// import { nodeResque } from '~/utils'

import { authenticator } from '~/utils/auth/auth.server'

export const rootLoader = async (request: Request) => {
	const account = await authenticator.isAuthenticated(request)

	// const account = await authenticator.isAuthenticated(request)
	// nodeResque()

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
