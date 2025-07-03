import { addToast, Button, ButtonGroup, Checkbox, CheckboxGroup } from '@heroui/react'
import { useFetcher, useLoaderData, useNavigation, useOutletContext } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { settingsNotificationLoader } from '~/loader/settings.notification.server'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import type { ActionData } from '~/actions/unsubscribe.server'
import type { LoaderData } from '~/loader/settings.notification.server'
import type { SettingsContext } from '~/routes/settings'

export const meta: MetaFunction = () => {
	return [
		{ title: '3DF - Notification Settings' },
		{ name: '3DF', content: 'Modify your 3DF notification application settings' },
	]
}

export const loader: LoaderFunction = async ({ request }) => {
	return settingsNotificationLoader(request)
}

export default function SettingsNotifications() {
	const fetcher = useFetcher<ActionData>()
	const navigation = useNavigation()
	const [selected, setSelected] = useState<string[]>([])
	const { teamTitles } = useLoaderData<LoaderData>()
	const { account } = useOutletContext<SettingsContext>()

	useEffect(() => {
		if (account) {
			const initialSelected = []

			for (let i = 1; i <= 9; i++) {
				const notificationKey = `team${i}Notification`

				if (account[notificationKey as keyof typeof account] === true) {
					initialSelected.push(`team${i}`)
				}
			}

			setSelected(initialSelected)
		}
	}, [])

	useEffect(() => {
		if (fetcher.data) {
			if (fetcher.data.message) {
				addToast({
					title: 'Error',
					description: fetcher.data.message,
					color: 'danger',
				})
			}
			if (fetcher.data.account) {
				addToast({
					title: 'Updated',
					description: 'Email notification subscription preferences have been updated',
					color: 'success',
				})
			}
		}
	}, [fetcher.data])

	return (
		<div>
			<h1 className='mb-4'>Email Depth Chart Notifications</h1>
			<p className='mb-2'>
				Select the teams that you would like to continue to receive new depth chart email notifications
				for:
			</p>
			<CheckboxGroup defaultValue={[]} value={selected} onValueChange={setSelected}>
				{teamTitles.map((team) => {
					return <Checkbox value={team.value}>{team.title}</Checkbox>
				})}
			</CheckboxGroup>
			<ButtonGroup className='my-4'>
				<Button
					color='default'
					isLoading={navigation.state !== 'idle'}
					isDisabled={navigation.state !== 'idle'}
					onPress={() => {
						setSelected([])
					}}
				>
					Clear
				</Button>
				<Button
					color='secondary'
					isLoading={navigation.state !== 'idle'}
					isDisabled={navigation.state !== 'idle'}
					onPress={() => {
						if (selected.length < teamTitles.length) {
							setSelected(
								teamTitles.map((team) => {
									return team.value
								})
							)
						}
					}}
				>
					Select All
				</Button>
				<Button
					color='success'
					isLoading={navigation.state !== 'idle'}
					isDisabled={navigation.state !== 'idle'}
					onPress={() => {
						fetcher.submit(
							selected.reduce(
								(acc: any, teamValue: string) => {
									acc[teamValue] = true
									return acc
								},
								{ accountId: account.id }
							),
							{
								method: 'POST',
								action: '/api/unsubscribe',
							}
						)
					}}
				>
					Update
				</Button>
			</ButtonGroup>
		</div>
	)
}
