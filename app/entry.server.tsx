/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */
import {
    createReadableStreamFromReadable,
    installGlobals,
} from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { isbot } from 'isbot'
import { PassThrough } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { initWorker } from '~/resque/worker.server.js'

import type { EntryContext } from '@remix-run/node'

installGlobals()

initWorker({
    schedule: false,
    team: true,
})

const ABORT_DELAY = 5000

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
) {
    const userAgent = request.headers.get('user-agent')
    const callbackName = isbot(userAgent ?? '') ? 'onAllReady' : 'onShellReady'

    return new Promise((resolve, reject) => {
        const { pipe, abort } = renderToPipeableStream(
            <RemixServer
                context={remixContext}
                url={request.url}
                abortDelay={ABORT_DELAY}
            />,
            {
                [callbackName]: () => {
                    const body = new PassThrough()
                    const stream = createReadableStreamFromReadable(body)

                    responseHeaders.set('Content-Type', 'text/html')
                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        })
                    )
                    pipe(body)
                },
                onShellError(error) {
                    reject(error)
                },
                onError(error) {
                    responseStatusCode = 500
                    console.error(error)
                },
            }
        )

        setTimeout(abort, ABORT_DELAY)
    })
}
