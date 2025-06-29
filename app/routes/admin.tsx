import {
	Accordion,
	AccordionItem,
	addToast,
	Button,
	ButtonGroup,
	Checkbox,
	CheckboxGroup,
	Input,
} from '@heroui/react'
import { useFetcher, useLoaderData, useNavigation } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { adminLoader } from '~/loader/admin.server'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import type { CreateAccountActionData } from '~/actions/api.createAccount.server'
import type { TeamCheckActionData } from '~/actions/api.teamCheck.server'
import type { LoaderData } from '~/loader/admin.server'

export const meta: MetaFunction = () => {
	return [
		{ title: '3DF - Admin' },
		{ name: '3DF/admin', content: 'Admin dashboard for 3DFantasy application' },
	]
}

export const loader: LoaderFunction = async ({ request }) => {
	return adminLoader(request)
}

const inputClass = 'my-2'

export default function Admin() {
	const navigation = useNavigation()
	const fetcher = useFetcher<TeamCheckActionData | CreateAccountActionData>()
	const { teamCheckBoxes } = useLoaderData<LoaderData>()
	const [selected, setSelected] = useState<string[]>([])
	const [formData, setFormData] = useState<{
		email: string
		password: string
		error: {
			email: null | string
		}
	}>({
		email: '',
		password: '',
		error: {
			email: null,
		},
	})
	useEffect(() => {
		if (fetcher.data) {
			if (fetcher.data.message) {
				addToast({
					title: `${fetcher.data.code} Error`,
					description: fetcher.data.message,
					color: 'danger',
				})
				setFormData({
					...formData,
					password: '',
					error: {
						...formData,
						email: fetcher.data.message,
					},
				})
			} else if (fetcher.data.api === 'teamCheck') {
				if (fetcher.data.count > 0) {
					addToast({
						title: `TeamCheck jobs successfully queued`,
						description: `${fetcher.data.count} jobs queued`,
					})
				}
			} else if (fetcher.data.api === 'createAccount') {
				if (fetcher.data.plainText) {
					setFormData({
						...formData,
						password: fetcher.data.plainText,
					})
				}
			}
		}
	}, [fetcher.data])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formDataField: string) => {
		setFormData({
			...formData,
			[formDataField]: e.target.value,
			error: {
				email: null,
			},
		})
	}

	return (
		<div className='my-4'>
			<Accordion defaultExpandedKeys={['team-check']} variant='light'>
				<AccordionItem key='team-check' aria-label='Team Checks Accordion section 1' title='Team Checks'>
					<CheckboxGroup defaultValue={[]} value={selected} onValueChange={setSelected}>
						{teamCheckBoxes.map((team, i) => {
							return (
								<Checkbox key={i} value={team.value}>
									{team.title}
								</Checkbox>
							)
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
									selected.reduce((acc: any, teamValue: string) => {
										acc[teamValue] = true
										return acc
									}, {}),
									{
										method: 'POST',
										action: '/api/teamCheck',
									}
								)
							}}
						>
							Submit
						</Button>
					</ButtonGroup>
				</AccordionItem>
				<AccordionItem
					key='create-accounts'
					aria-label='Create accounts Accordion section 2'
					title='Create Accounts'
				>
					<div className='flex flex-row'>
						<div className='w-3/12 mr-4'>
							<Input
								className={inputClass}
								type='text'
								name='email'
								label='Email'
								color={formData.error.email ? 'danger' : 'default'}
								errorMessage={formData.error.email ? formData.error.email : ''}
								value={formData.email}
								onChange={(e) => handleInputChange(e, 'email')}
							/>
							<div className='flex flex-row justify-between'>
								<Button
									type='button'
									onPress={() => {
										fetcher.submit(
											{
												email: formData.email,
											},
											{
												method: 'POST',
												action: '/api/createAccount/',
											}
										)
									}}
								>
									Create
								</Button>
								<p>{formData.password}</p>
							</div>
						</div>
					</div>
				</AccordionItem>
			</Accordion>
		</div>
	)
}
