import { Card, CardBody } from '@heroui/react'
import { useLoaderData, useNavigate } from 'react-router'
import { useEffect } from 'react'
import { homeLoader } from '~/loader/home.server'
import { useAuth } from '~/providers'

import type { Route } from './+types/home'
import type { LoaderData } from '~/loader/home.server'

export const meta: Route.MetaFunction = () => {
    return [
        { title: '3DF - Home' },
        { name: '3DF/home', content: 'Home page for 3DFantasy application' },
    ]
}

export async function loader({ request }: Route.LoaderArgs) {
    return homeLoader(request)
}

export default function Home() {
    const navigate = useNavigate()
    const { account, nextUrl } = useLoaderData<LoaderData>()
    const { account: authAccount, setAccount } = useAuth()

    useEffect(() => {
        if (!authAccount && account) {
            setAccount({
                id: account.id,
                email: account.email,
                role: account.role,
            })
        }
        if (nextUrl) {
            navigate(nextUrl)
        }
    }, [account, authAccount, nextUrl, navigate, setAccount])

    return (
        <div className="my-2">
            <Card className="mt-4">
                <CardBody className="py-8">
                    <h1 className="text-2xl font-bold mb-2">Welcome to 3DF</h1>
                    <p className="text-foreground/60">
                        CFL depth chart tracking and play-by-play analytics.
                    </p>
                </CardBody>
            </Card>
        </div>
    )
}
