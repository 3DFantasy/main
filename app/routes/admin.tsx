import { useLoaderData } from '@remix-run/react'
import { adminLoader } from '~/loader/admin.server'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import type { LoaderData } from '~/loader/admin.server'

export const meta: MetaFunction = () => {
	return [{ title: '3DF - Admin' }, { name: 'Admin dashboard for 3DF' }]
}

export const loader: LoaderFunction = async ({ request }) => {
	return adminLoader(request)
}

export default function Admin() {
	const { account } = useLoaderData<LoaderData>()

	return <p>Admin</p>
}
