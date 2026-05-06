import { Button, Card, CardBody, Link } from '@heroui/react'
import { useLocation, useNavigate } from 'react-router';

interface ErrorBoundaryProps {
    message: string
    code: number
}
export function ErrorBoundary({ message, code }: ErrorBoundaryProps) {
    const navigate = useNavigate()
    const location = useLocation()

    console.log(`${code} error: ${message}`)
    console.log(`${location.pathname}`)

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <Card className="w-full max-w-md">
                <CardBody className="flex flex-col items-center gap-4 py-8">
                    <h1 className="text-2xl font-bold">3DF</h1>
                    <h2 className="text-lg text-foreground/60">{message}</h2>
                    <p>Sorry about that ... </p>
                    <div className="flex flex-row gap-2 mt-2">
                        <Button onPress={() => navigate(-1)} color="default">
                            Back
                        </Button>
                        <Button href="/home" as={Link} color="primary">
                            Home
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
