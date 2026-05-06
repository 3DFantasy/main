import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useRouteError,
} from 'react-router'
import {
    ErrorBoundary as ErrorBoundaryComponent,
    Loading,
    Sidebar,
} from '~/components'
import { rootLoader } from '~/loader/root.server'
import { Providers } from '~/providers'

import type { Route } from './+types/root'
import type { LoaderData } from '~/loader/root.server'

import 'remixicon/fonts/remixicon.css'
import '~/styles/loading.css'
import '~/styles/main.css'
import '~/styles/tailwind.css'
import '~/styles/teams/index.css'

export type RootContextAccount = {
    id: number
    email: string
    role: string
}

export type RootContext = {
    setToast: React.Dispatch<
        React.SetStateAction<{ message: null | string; error?: boolean }>
    >
}

export async function loader({ request }: Route.LoaderArgs) {
    return rootLoader(request)
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export default function App() {
    const { account } = useLoaderData<LoaderData>()

    return (
        <Providers initialAccount={account}>
            <main className="text-foreground bg-background bg-grain">
                <div className="flex min-h-dvh">
                    <Sidebar />
                    <div className="relative z-10 flex-1 overflow-y-auto pt-14 md:pt-0">
                        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
                            <Outlet />
                            <Loading overlay={true} />
                        </div>
                    </div>
                </div>
            </main>
        </Providers>
    )
}

export function ErrorBoundary() {
    const error = useRouteError()
    let errorMessage: string = 'An unknown error occurred'

    if (error instanceof Error) {
        errorMessage = error.message
    } else if (typeof error === 'object' && error !== null) {
        // Handle Response objects from Remix
        if ('data' in error && error.data && typeof error.data === 'object') {
            // @ts-expect-error narrowing from `unknown` Remix error
            errorMessage = error.data.message || JSON.stringify(error.data)
        } else if ('statusText' in error) {
            // @ts-expect-error narrowing from `unknown` Remix error
            errorMessage = error.statusText
        } else if ('message' in error) {
            // @ts-expect-error narrowing from `unknown` Remix error
            errorMessage = error.message
        } else {
            errorMessage = JSON.stringify(error)
        }
    } else if (typeof error === 'string') {
        errorMessage = error
    }

    return (
        <html lang="en">
            <head>
                <title>Oh no!</title>
                <Meta />
                <Links />
            </head>
            <body>
                <ErrorBoundaryComponent code={500} message={errorMessage} />
                <Scripts />
            </body>
        </html>
    )
}
