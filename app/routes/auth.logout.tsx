import { redirect } from 'react-router'
import { sessionStorage } from '~/utils/auth/sessionStorage.server'

import type { Route } from './+types/auth.logout'

export const meta: Route.MetaFunction = () => {
    return [
        { title: '3DF - Logout' },
        {
            name: '3DF/auth/logout',
            content: 'Logout route for 3DFantasy application',
        },
    ]
}

export async function loader({ request }: Route.LoaderArgs) {
    const session = await sessionStorage.getSession(
        request.headers.get('Cookie')
    )

    return redirect('/auth/login', {
        headers: {
            'Set-Cookie': await sessionStorage.destroySession(session),
        },
    })
}

export default function Logout() {}
