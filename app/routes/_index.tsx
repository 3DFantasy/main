import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
	return [{ title: '3DF - Index' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function Index() {
	return (
		<div>
			<p>index</p>
		</div>
	)
}
