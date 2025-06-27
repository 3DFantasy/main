import {
	Accordion,
	AccordionItem,
	addToast,
	Button,
	ButtonGroup,
	Checkbox,
	CheckboxGroup,
} from '@heroui/react'
import { useFetcher, useLoaderData, useNavigation } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { ActionData } from '~/actions/api.teamCheck.server'
import { adminLoader } from '~/loader/admin.server'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
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

export default function Admin() {
	const navigation = useNavigation()
	const fetcher = useFetcher<ActionData>()
	const { teamCheckBoxes } = useLoaderData<LoaderData>()
	const [selected, setSelected] = useState<string[]>([])

	useEffect(() => {
		if (fetcher.data) {
			if (fetcher.data.message) {
				addToast({
					title: fetcher.data.message,
					description: fetcher.data.code,
					color: 'danger',
				})
			}
			if (fetcher.data.count > 0) {
				addToast({
					title: `TeamCheck jobs successfully queued`,
					description: `${fetcher.data.count} jobs queued`,
				})
			}
		}
	}, [fetcher.data])

	return (
		<div className='my-4'>
			<Accordion defaultExpandedKeys={['team-check']}>
				<AccordionItem key='team-check' aria-label='Team Checks Accordion section 1' title='Team Checks'>
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
			</Accordion>
		</div>
	)
}
