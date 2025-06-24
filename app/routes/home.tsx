import { useLoaderData } from '@remix-run/react'
import { homeLoader, LoaderData } from '~/loader/home.server'
import { useAuth } from '~/providers'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { useEffect } from 'react'

export const meta: MetaFunction = () => {
	return [{ title: '3DF - Home' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader: LoaderFunction = async ({ request }) => {
	return homeLoader(request)
}

export default function Home() {
	const { account } = useLoaderData<LoaderData>()
	const { account: authAccount, setAccount } = useAuth()

	useEffect(() => {
		if (!authAccount) {
			setAccount({
				id: account.id,
				email: account.email,
				role: account.role,
			})
		}
	}, [])

	return <p>Home</p>
}
