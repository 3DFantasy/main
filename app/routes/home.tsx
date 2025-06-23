import { useLoaderData, useOutletContext } from '@remix-run/react'
import { useEffect } from 'react'
import { homeLoader, LoaderData } from '~/loader/home.server'
import { useAuth } from '~/providers'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import type { RootContext } from '~/root'

export const meta: MetaFunction = () => {
	return [{ title: '3DF - Home' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader: LoaderFunction = async ({ request }) => {
	return homeLoader(request)
}

export default function Home() {
	const { setToast } = useOutletContext<RootContext>()
	const { account } = useLoaderData<LoaderData>()
	const { account: authAccount, setAccount } = useAuth()

	useEffect(() => {
		if (!authAccount) {
			setAccount({
				id: account.id,
				email: account.email,
				role: account.role,
			})
			setToast({
				message: `Authenticated: ${account.email}`,
			})
		}
	}, [account])

	return <p>Home</p>
}
