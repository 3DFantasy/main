import { addToast, Button, Input } from '@heroui/react'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { ActionData, authLoginAction } from '~/actions/auth.login.server'
import { authLoginLoader } from '~/loader/auth.login.server'

import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
	return [
		{ title: '3DF - Login' },
		{ name: '3DF/auth/login', content: 'Login page for 3DFantasy application' },
	]
}

export const loader: LoaderFunction = async ({ request }) => {
	return authLoginLoader(request)
}

export const action: ActionFunction = async ({ request }) => {
	return authLoginAction(request)
}

export default function Login() {
	const navigation = useNavigation()
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
		if (actionData) {
			console.log(actionData)
			if (actionData.message) {
				setError({
					email: true,
					password: true,
				})
				addToast({
					title: actionData.message,
					description: `${formData.email}`,
					color: 'danger',
				})
			}
		}
	}, [actionData])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formDataField: string) => {
		setError({
			email: false,
			password: false,
		})
		setFormData((form) => ({ ...form, [formDataField]: e.target.value }))
	}

	return (
		<div className='mt-40 mx-auto max-w-80'>
			<h1 className='mx-auto w-fit'>Login</h1>
			<Form method='post'>
				<Input
					className={inputClass}
					type='email'
					name='email'
					label='Email'
					color={error.email ? 'danger' : 'default'}
					value={formData.email}
					onChange={(e) => handleInputChange(e, 'email')}
				/>
				<Input
					className={inputClass}
					type={formData.hidePassword ? 'password' : 'text'}
					label='Password'
					name='password'
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
								<i className='ri-eye-line ri-lg'></i>
							) : (
								<i className='ri-eye-off-line ri-lg'></i>
							)}
						</button>
					}
				/>
				<div className='mx-auto w-fit'>
					<Button
						color='default'
						isDisabled={
							navigation.state !== 'idle' ||
							formData.password.length === 0 ||
							formData.email.length === 0
						}
						isLoading={navigation.state !== 'idle'}
						type='submit'
					>
						Sign in
					</Button>
				</div>
			</Form>
		</div>
	)
}
