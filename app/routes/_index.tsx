import { Button, Card, CardBody, Link } from '@heroui/react'
import { indexLoader } from '~/loader/index.server'

import type { Route } from './+types/_index'

export const meta: Route.MetaFunction = () => {
    return [
        { title: '3DF' },
        {
            name: '3DF',
            content:
                'Welcome to the 3DFantasy application, learn a bit more about us here.',
        },
    ]
}

export async function loader({ request }: Route.LoaderArgs) {
    return indexLoader(request)
}

export default function Index() {
    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <Card className="w-full max-w-lg">
                <CardBody className="flex flex-col items-center gap-4 py-12">
                    <h1 className="text-3xl font-bold">3DF</h1>
                    <p className="text-foreground/60 text-center">
                        CFL depth chart tracking and play-by-play analytics
                    </p>
                    <div className="flex gap-3 mt-4">
                        <Button
                            as={Link}
                            href="/auth/login"
                            color="primary"
                            variant="flat"
                        >
                            Log In
                        </Button>
                        <Button
                            as={Link}
                            href="/auth/signup"
                            color="default"
                            variant="bordered"
                        >
                            Sign Up
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
