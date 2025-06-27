import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useRouteError,
} from '@remix-run/react'
import { useState } from 'react'
import { ErrorBoundary as ErrorBoundaryComponent, Header } from '~/components'
import { rootLoader } from '~/loader/root.server'
import { Providers } from '~/providers'

import type { LoaderFunction } from '@remix-run/node'
import type { LoaderData } from '~/loader/root.server'

import 'remixicon/fonts/remixicon.css'
import '~/styles/main.css'
import '~/styles/tailwind.css'

export type RootContextAccount = {
	id: number
	email: string
	role: string
}

export type RootContext = {
	setToast: React.Dispatch<React.SetStateAction<{ message: null | string; error?: boolean }>>
}

export const loader: LoaderFunction = async ({ request }) => {
	return rootLoader(request)
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
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
	const [theme, setTheme] = useState('dark')

	return (
		<Providers initialAccount={account}>
			<main className={`${theme} text-foreground bg-background`}>
				<Header />
				<div className='container mx-auto'>
					<Outlet />
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
			// @ts-ignore
			errorMessage = error.data.message || JSON.stringify(error.data)
		} else if ('statusText' in error) {
			// @ts-ignore
			errorMessage = error.statusText
		} else if ('message' in error) {
			// @ts-ignore
			errorMessage = error.message
		} else {
			errorMessage = JSON.stringify(error)
		}
	} else if (typeof error === 'string') {
		errorMessage = error
	}

	return (
		<html>
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
