import { useLoaderData, useOutletContext } from '@remix-run/react'
import { useEffect } from 'react'
import { homeLoader, HomeLoaderData } from '~/loader/home.server'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import type { RootContext } from '~/root'

export const meta: MetaFunction = () => {
	return [{ title: '3DF - Home' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader: LoaderFunction = async ({ request }) => {
	return homeLoader(request)
}

export default function Home() {
	const { setAccount, setToast } = useOutletContext<RootContext>()
	const { account } = useLoaderData<HomeLoaderData>()

	useEffect(() => {
		if (account) {
			setAccount(account)
			setToast({
				message: `Authenticated: ${account.email}`,
				error: false,
			})
		}
	}, [account])

	return <p>Home</p>
}
