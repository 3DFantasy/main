import { useEffect, useState } from 'react'

import { Button, Input } from '@nextui-org/react'
import { authSignupLoader } from '~/loader/auth.signup.server'
import { authSignupAction } from '~/actions/auth.signup.server'
import { useFetcher, useLoaderData, useOutletContext } from '@remix-run/react'

import type { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import type { RootContext } from '~/root'

export const meta: MetaFunction = () => {
	return [{ title: 'Signup | 3DF' }, { name: '3DF Signup', content: '3DF signup page' }]
}

export const loader: LoaderFunction = async ({ request }) => {
	return authSignupLoader(request)
}

export async function action({ request }: ActionFunctionArgs) {
	return authSignupAction(request)
}

const inputClass = 'my-2'

export default function Signup() {
	const loaderData = useLoaderData()
	const { setToast, setAccount } = useOutletContext<RootContext>()
	const fetcher = useFetcher<{ message: string; code: number }>()
	const [formData, setFormData] = useState<{
		email: string
		password: string
		confirm: string
		hidePassword: boolean
	}>({
		email: '',
		password: '',
		confirm: '',
		hidePassword: true,
	})
	const [error, setError] = useState<{
		email: boolean
		password: boolean
	}>({
		email: false,
		password: false,
	})

	useEffect(() => {
		setAccount(null)
	}, [])

	useEffect(() => {
		if (fetcher.data) {
			if (fetcher.data.message.includes('email')) {
				setError({
					...error,
					email: true,
				})
				setToast({
					error: true,
					message: fetcher.data.message,
				})
			}
		}
	}, [fetcher.data])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formDataField: string) => {
		setError({
			email: false,
			password: false,
		})
		setFormData((prev) => ({
			...prev,
			[formDataField]: e.target.value,
		}))
	}

	return (
		<div className='mt-40 mx-auto max-w-80'>
			<h1 className='mx-auto w-fit'>Create Account</h1>
			<form method='POST'>
				<Input
					className={inputClass}
					type='email'
					name='email'
					label='Email'
					defaultValue={formData.email}
					color={error.email ? 'danger' : 'default'}
					onChange={(e) => handleInputChange(e, 'email')}
				/>

				<Input
					className={inputClass}
					type={formData.hidePassword ? 'password' : 'text'}
					label='Password'
					name='password'
					defaultValue={formData.password}
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
				<Input
					className={inputClass}
					type={formData.hidePassword ? 'password' : 'text'}
					label='Confirm Password'
					name='confirm'
					value={formData.confirm}
					color={'default'}
					onChange={(e) => handleInputChange(e, 'confirm')}
				/>
				<div className='mx-auto w-fit'>
					<Button
						color='default'
						type='button'
						onClick={() =>
							fetcher.submit(
								{
									email: formData.email,
									password: formData.password,
								},
								{
									action: '/auth/signup',
									method: 'POST',
								}
							)
						}
						isDisabled={
							formData.email.length === 0 ||
							formData.password.length === 0 ||
							formData.password !== formData.confirm
						}
					>
						Sign up
					</Button>
				</div>
			</form>
		</div>
	)
}
