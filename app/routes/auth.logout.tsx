import { LoaderFunction, redirect } from '@remix-run/node'
import { sessionStorage } from '~/utils/auth/sessionStorage.server'

export const loader: LoaderFunction = async ({ request }) => {
	const session = await sessionStorage.getSession(request.headers.get('Cookie'))

	return redirect('/auth/login', {
		headers: {
			'Set-Cookie': await sessionStorage.destroySession(session),
		},
	})
}

export default function Logout() {}
