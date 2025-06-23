import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { Header, Toast } from '~/components'
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

// export const links: LinksFunction = () => [
// 	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
// 	{
// 		rel: 'preconnect',
// 		href: 'https://fonts.gstatic.com',
// 		crossOrigin: 'anonymous',
// 	},
// 	{
// 		rel: 'stylesheet',
// 		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
// 	},
// ]

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
	const [toast, setToast] = useState<{
		message: null | string
		error?: boolean
	}>({
		message: null,
		error: false,
	})

	const rootContext: RootContext = { setToast }

	return (
		<Providers rootAccount={account} setToast={setToast}>
			<main className={`${theme} text-foreground bg-background`}>
				<Header setToast={setToast} />
				<div className='container mx-auto'>
					<Outlet context={rootContext} />
					<Toast message={toast.message} error={toast.error} setToast={setToast} />
				</div>
			</main>
		</Providers>
	)
}
