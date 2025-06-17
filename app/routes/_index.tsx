import { indexLoader } from '~/loader/index.server'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
	return [{ title: '3DF - Index' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader: LoaderFunction = async ({ request }) => {
	return indexLoader(request)
}

export default function Index() {
	return (
		<div>
			<p>index</p>
		</div>
	)
}
