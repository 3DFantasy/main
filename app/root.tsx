import { ReactNode, useState } from 'react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Header } from '~/components'
import { rootLoader } from './loader/root.server'
// import type { LinksFunction } from '@remix-run/node'

import '~/styles/tailwind.css'
import '~/styles/main.css'
import type { LoaderFunction } from '@remix-run/node'

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

export function Providers({ children }: { children: ReactNode }) {
	return (
		<NextUIProvider>
			<NextThemesProvider attribute='class' defaultTheme='dark'>
				{children}
			</NextThemesProvider>
		</NextUIProvider>
	)
}

export default function App() {
	const [theme, setTheme] = useState('dark')
	return (
		<Providers>
			<main className={`${theme} text-foreground bg-background`}>
				<Header />
				<div className='container mx-auto'>
					<Outlet />
				</div>
			</main>
		</Providers>
	)
}
