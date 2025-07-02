import { addToast, Button, Input } from '@heroui/react'
import { useFetcher, useNavigation, useOutletContext } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { settingsAccountAction } from '~/actions/settings.account.server'
import { settingsAccountLoader } from '~/loader/settings.account.server'

import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import type { ActionData } from '~/actions/settings.account.server'
import type { SettingsContext } from './settings'

export const meta: MetaFunction = () => {
	return [
		{ title: '3DF - Account Settings' },
		{ name: '3DF', content: 'Modify your 3DF account application settings' },
	]
}

export const action: ActionFunction = async ({ request, params }) => {
	return settingsAccountAction(request, params)
}

export const loader: LoaderFunction = async ({ request }) => {
	return settingsAccountLoader(request)
}

export default function SettingsAccount() {
	const fetcher = useFetcher<ActionData>()
	const navigation = useNavigation()
	const { account } = useOutletContext<SettingsContext>()

	const [formData, setFormData] = useState<{
		email: string
		currentPassword: string
		newPassword: string
		newPasswordConfirm: string
		hidePassword: boolean
	}>({
		email: '',
		currentPassword: '',
		newPassword: '',
		newPasswordConfirm: '',
		hidePassword: true,
	})
	const [error, setError] = useState({
		email: false,
		newPassword: false,
		currentPassword: false,
		newPasswordConfirm: false,
	})

	useEffect(() => {
		if (fetcher.data) {
			if (fetcher.data.message) {
				addToast({
					title: 'Error',
					description: `${fetcher.data.message}`,
					color: 'danger',
				})
				if (fetcher.data.message.includes('Current password')) {
					setError({
						...error,
						currentPassword: true,
					})
				} else {
					setError({
						...error,
						newPasswordConfirm: true,
						newPassword: true,
						currentPassword: true,
					})
				}
			}
			if (fetcher.data.code === 200) {
				addToast({
					title: 'Account updated',
					description: `Account details successfully updated`,
					color: 'default',
				})
			}
		}
	}, [fetcher.data])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formDataField: string) => {
		setError({
			email: false,
			newPassword: false,
			currentPassword: false,
			newPasswordConfirm: false,
		})
		setFormData((form) => ({ ...form, [formDataField]: e.target.value }))
	}

	return (
		<div>
			{/* <h3 className='mb-4'>Profile</h3>
			<p>(coming soon)</p>
			<Divider className='my-4' /> */}
			<h3 className='mb-4'>Account</h3>
			<div className='flex flex-col w-full gap-4'>
				<div className='flex flex-wrap md:flex-nowrap w-1/2 pr-2'>
					<Input
						label='Email'
						placeholder='Enter your email'
						type='email'
						value={account.email}
						isDisabled={true}
					/>
				</div>
				<div className='flex flex-wrap md:flex-nowrap w-1/2 pr-2'>
					<Input
						label='Current Password'
						placeholder='Enter your current password'
						type={formData.hidePassword ? 'password' : 'text'}
						value={formData.currentPassword}
						color={error.currentPassword ? 'danger' : 'default'}
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
						onChange={(e) => handleInputChange(e, 'currentPassword')}
					/>
				</div>
				<div className='flex flex-wrap md:flex-nowrap gap-4'>
					<Input
						label='New Password'
						placeholder='Enter your new password'
						type={formData.hidePassword ? 'password' : 'text'}
						value={formData.newPassword}
						color={error.newPassword ? 'danger' : 'default'}
						onChange={(e) => handleInputChange(e, 'newPassword')}
					/>
					<Input
						label='Confirm New Password'
						placeholder='Enter your new password again to confirm'
						type={formData.hidePassword ? 'password' : 'text'}
						value={formData.newPasswordConfirm}
						color={error.newPasswordConfirm ? 'danger' : 'default'}
						onChange={(e) => handleInputChange(e, 'newPasswordConfirm')}
					/>
				</div>
				<div>
					<Button
						color='default'
						isLoading={navigation.state !== 'idle'}
						isDisabled={
							formData.newPasswordConfirm !== formData.newPassword ||
							formData.newPasswordConfirm.length === 0 ||
							formData.newPasswordConfirm.length === 0 ||
							formData.currentPassword.length === 0
						}
						onPress={() => {
							fetcher.submit(
								{
									email: account.email,
									currentPassword: formData.currentPassword,
									newPassword: formData.newPassword,
									newPasswordConfirm: formData.newPasswordConfirm,
								},
								{
									method: 'POST',
									action: '/settings/account',
								}
							)
						}}
					>
						Update{' '}
					</Button>
				</div>
			</div>
		</div>
	)
}
