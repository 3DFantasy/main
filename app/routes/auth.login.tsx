import { addToast, Button, Card, CardBody, CardHeader, Input } from '@heroui/react'
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router'
import { useEffect, useState } from 'react'
import { ActionData, authLoginAction } from '~/actions/auth.login.server'
import { authLoginLoader } from '~/loader/auth.login.server'

import type { Route } from './+types/auth.login'
import type { LoaderData } from '~/loader/auth.login.server'

export const meta: Route.MetaFunction = () => {
    return [
        { title: '3DF - Login' },
        {
            name: '3DF/auth/login',
            content: 'Login page for 3DFantasy application',
        },
    ]
}

export async function loader({ request }: Route.LoaderArgs) {
    return authLoginLoader(request)
}

export async function action({ request }: Route.ActionArgs) {
    return authLoginAction(request)
}

export default function Login() {
    const navigation = useNavigation()
    const { nextUrl } = useLoaderData<LoaderData>()
    const actionData = useActionData<ActionData>()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        hidePassword: true,
    })
    const [error, setError] = useState({
        email: false,
        password: false,
    })

    const inputClass = 'my-2'

    useEffect(() => {
        if (actionData?.message) {
            setError({ email: true, password: true })
            addToast({ title: actionData.message, color: 'danger' })
        }
    }, [actionData])

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        formDataField: string
    ) => {
        setError({
            email: false,
            password: false,
        })
        setFormData((form) => ({ ...form, [formDataField]: e.target.value }))
    }

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <Card className="w-full max-w-sm">
                <CardHeader className="flex justify-center">
                    <h1 className="text-xl font-semibold">Login</h1>
                </CardHeader>
                <CardBody>
                    <Form
                        method="post"
                        action={`/auth/login${nextUrl ? `?nextUrl=${nextUrl}` : ''}`}
                    >
                        <Input
                            className={inputClass}
                            type="email"
                            name="email"
                            label="Email"
                            color={error.email ? 'danger' : 'default'}
                            value={formData.email}
                            onChange={(e) => handleInputChange(e, 'email')}
                        />
                        <Input
                            className={inputClass}
                            type={formData.hidePassword ? 'password' : 'text'}
                            label="Password"
                            name="password"
                            value={formData.password}
                            color={error.password ? 'danger' : 'default'}
                            onChange={(e) => handleInputChange(e, 'password')}
                            endContent={
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setFormData({
                                            ...formData,
                                            hidePassword: !formData.hidePassword,
                                        })
                                    }}
                                >
                                    {formData.hidePassword ? (
                                        <i className="ri-eye-line ri-lg"></i>
                                    ) : (
                                        <i className="ri-eye-off-line ri-lg"></i>
                                    )}
                                </button>
                            }
                        />
                        <div className="mx-auto w-fit mt-2">
                            <Button
                                color="primary"
                                isDisabled={
                                    navigation.state !== 'idle' ||
                                    formData.password.length === 0 ||
                                    formData.email.length === 0
                                }
                                isLoading={navigation.state !== 'idle'}
                                type="submit"
                            >
                                Sign in
                            </Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </div>
    )
}
