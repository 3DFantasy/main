import { addToast } from '@heroui/react'
import { LoaderFunction, MetaFunction } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { unsubscribeLoader } from '~/loader/unsubscribe.server'

import type { LoaderData } from '~/loader/unsubscribe.server'

export const meta: MetaFunction = () => {
	return [
		{ title: '3DF - Unsubscribe' },
		{ name: '3DF/unsubscribe', content: 'Unsubscribe page for 3DF email notifications' },
	]
}

export const loader: LoaderFunction = async ({ request, params }) => {
	return unsubscribeLoader(request, params)
}

export default function Unsubscribe() {
	const navigate = useNavigate()
	const error = useRef(false)

	const { account, message, code } = useLoaderData<LoaderData>()

	useEffect(() => {
		if ((message || code) && !error.current) {
			addToast({
				color: 'danger',
				title: 'Error',
				description: message,
			})
			error.current = true
			navigate('/home')
		}
	}, [message, code])

	return <p>Unsubscribe</p>
}
