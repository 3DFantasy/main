import { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
	return [
		{ title: '3DF - Unsubscribe' },
		{ name: '3DF/unsubscribe', content: 'Unsubscribe page for 3DF email notifications' },
	]
}

export default function Unsubscribe() {
	return <p>Unsubscribe</p>
}
