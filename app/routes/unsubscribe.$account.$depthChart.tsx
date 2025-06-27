import {
	Accordion,
	AccordionItem,
	addToast,
	Button,
	ButtonGroup,
	Checkbox,
	CheckboxGroup,
} from '@heroui/react'
import { LoaderFunction, MetaFunction } from '@remix-run/node'
import { useFetcher, useLoaderData, useNavigate, useNavigation } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'
import { unsubscribeLoader } from '~/loader/unsubscribe.server'

import { ActionData } from '~/actions/unsubscribe.server'
import type { LoaderData } from '~/loader/unsubscribe.server'

export const meta: MetaFunction = () => {
	return [
		{ title: '3DF - Unsubscribe' },
		{ name: '3DF/unsubscribe', content: 'Unsubscribe page for 3DF email notifications' },
	]
}

export const loader: LoaderFunction = async ({ request, params }) => {
	return unsubscribeLoader(request, params)
}

export default function Unsubscribe() {
	const navigate = useNavigate()
	const navigation = useNavigation()
	const fetcher = useFetcher<ActionData>()
	const error = useRef(false)
	const [selected, setSelected] = useState<string[]>([])

	const { account, teamCheckBoxes, message, code } = useLoaderData<LoaderData>()

	useEffect(() => {
		if ((message || code) && !error.current) {
			addToast({
				color: 'danger',
				title: 'Error',
				description: message,
			})
			error.current = true
			navigate('/home')
		}
	}, [message, code])

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
	}, [account])

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
				const newSelected = []

				for (let i = 1; i <= 9; i++) {
					const key = `team${i}Notification` as keyof typeof fetcher.data.account

					if (fetcher.data.account[key] === true) {
						newSelected.push(`team${i}`)
					}
				}

				setSelected(newSelected)
				addToast({
					title: 'Updated',
					description: 'Email notification subscription preferences have been updated',
					color: 'success',
				})
			}
		}
	}, [fetcher.data])

	return (
		<div className='mt-4'>
			<Accordion defaultExpandedKeys={['unsubscribe-all']}>
				<AccordionItem
					key='unsubscribe-all'
					aria-label='Unsubscribe from all team email notification accordion section'
					title='Unsubscribe from all'
				>
					<Button
						onPress={() => {
							fetcher.submit(
								{
									accountId: account.id,
									team1: false,
									team2: false,
									team3: false,
									team4: false,
									team5: false,
									team6: false,
									team7: false,
									team8: false,
									team9: false,
								},
								{
									action: `/api/unsubscribe`,
									method: 'POST',
								}
							)
						}}
					>
						Unsubscribe
					</Button>
				</AccordionItem>
				<AccordionItem
					key='unsubscribe-team-selection'
					aria-label='Unsubscribe from select teams accordion section'
					title='Unsubscribe per team'
				>
					<p className='mb-4'>
						Select the teams that you would like to continue to receive new depth chart email
						notifications for
					</p>
					<CheckboxGroup defaultValue={[]} value={selected} onValueChange={setSelected}>
						{teamCheckBoxes.map((team) => {
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
								if (selected.length < teamCheckBoxes.length) {
									setSelected(
										teamCheckBoxes.map((team) => {
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
				</AccordionItem>
			</Accordion>
		</div>
	)
}
