import { createRequestHandler } from '@remix-run/express'
import { installGlobals } from '@remix-run/node'
import express from 'express'
import * as vite from 'vite'
import { initWorker } from '~/resque/worker.server.js'

installGlobals()

initWorker({
	schedule: false,
	teamCheck: true,
})

async function startServer() {
	let viteDevServer

	if (process.env.NODE_ENV === 'development') {
		viteDevServer = await vite.createServer({
			server: { middlewareMode: true },
		})
	}

	const app = express()

	if (viteDevServer) {
		app.use(viteDevServer.middlewares)
	} else {
		app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }))
	}

	app.all(
		'*',
		createRequestHandler({
			build: viteDevServer
				? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
				: require('../build/server/index.js'),
		})
	)

	const port = process.env.PORT || 5173
	app.listen(port, () => {
		console.log(`app listening on port: ${port}`)
	})
}

startServer().catch(console.error)
