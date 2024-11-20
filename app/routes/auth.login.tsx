import { useEffect, useState } from 'react'
import { authLoginAction } from '~/actions/auth.login.server'
import { authLoginLoader } from '~/loader/auth.login.server'
import { Button, Input } from '@nextui-org/react'
import { Form, useActionData, useLoaderData, useOutletContext } from '@remix-run/react'

import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { RootContext } from '~/root'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Login | OneReview' },
		{ name: 'Summary API Login screen', content: 'Provide password and authenticate to continue' },
	]
}

export const loader: LoaderFunction = async ({ request }) => {
	return authLoginLoader(request)
}
export const action: ActionFunction = async ({ request }) => {
	return authLoginAction(request)
}

export default function Login() {
	const { setAccount, setToast } = useOutletContext<RootContext>()
	const actionData = useActionData<{
		fields: {
			password: string
			email: string
		}
	}>()
	const { error } = useLoaderData<typeof loader>()
	const [formData, setFormData] = useState({
		email: '',
		password: actionData?.fields?.email || '',
		hidePassword: true,
	})
	const inputClass = 'my-2'

	useEffect(() => {
		setAccount(null)
	}, [])

	useEffect(() => {
		console
		if (error === 'credentials') {
			setToast({
				message: 'Login credentials not found',
				error: true,
			})
		}
	}, [error])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formDataField: string) => {
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
					value={formData.email}
					onChange={(e) => handleInputChange(e, 'email')}
				/>
				<Input
					className={inputClass}
					type={formData.hidePassword ? 'password' : 'text'}
					label='Password'
					name='password'
					value={formData.password}
					color={error ? 'danger' : 'default'}
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
					<Button color='default' type='submit'>
						Sign in
					</Button>
				</div>
			</Form>
		</div>
	)
}
