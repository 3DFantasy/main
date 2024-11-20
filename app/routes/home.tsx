import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
	return [{ title: '3DF - Home' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function Home() {
	return <p>Home</p>
}
