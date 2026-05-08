import {
    Accordion,
    Button,
    ButtonGroup,
    Card,
    Checkbox,
    CheckboxGroup,
    toast,
} from '@heroui/react'
import { useFetcher, useLoaderData, useNavigate, useNavigation } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import { unsubscribeLoader } from '~/loader/unsubscribe.account.depthChart.server'

import type { Route } from './+types/unsubscribe.$account.$depthChart'
import type { ActionData } from '~/actions/unsubscribe.server'
import type { LoaderData } from '~/loader/unsubscribe.account.depthChart.server'

export const meta: Route.MetaFunction = () => {
    return [
        { title: '3DF - Unsubscribe' },
        {
            name: '3DF/unsubscribe',
            content: 'Unsubscribe page for 3DF email notifications',
        },
    ]
}

export async function loader({ request, params }: Route.LoaderArgs) {
    return unsubscribeLoader(request, params)
}

export default function Unsubscribe() {
    const navigate = useNavigate()
    const navigation = useNavigation()
    const fetcher = useFetcher<ActionData>()
    const error = useRef(false)
    const [selected, setSelected] = useState<string[]>([])
    const { account, teamTitles, message, code } = useLoaderData<LoaderData>()

    useEffect(() => {
        if ((message || code) && !error.current) {
            toast('Error', {
                description: message,
                variant: 'danger',
            })
            error.current = true
            navigate('/home')
        }
    }, [message, code, navigate])

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

    const fetcherData = fetcher.data
    useEffect(() => {
        if (!fetcherData || !account) return
        if (fetcherData.message) {
            toast('Error', {
                description: fetcherData.message,
                variant: 'danger',
            })
        }
        if (fetcherData.account) {
            const newSelected: string[] = []
            for (let i = 1; i <= 9; i++) {
                const key =
                    `team${i}Notification` as keyof typeof fetcherData.account
                if (fetcherData.account[key] === true) {
                    newSelected.push(`team${i}`)
                }
            }
            setSelected(newSelected)
            toast('Updated', {
                description: `Email notification subscription preferences have been updated for ${account.email}`,
                variant: 'success',
            })
        }
    }, [fetcherData, account])

    return (
        <Card className="mt-4">
            <Card.Content>
            <Accordion defaultExpandedKeys={['unsubscribe-all']}>
                <Accordion.Item
                    id="unsubscribe-all"
                    aria-label="Unsubscribe from all team email notification accordion section"
                >
                    <Accordion.Heading>
                        <Accordion.Trigger>Unsubscribe from all</Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Body>
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
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item
                    id="unsubscribe-team-selection"
                    aria-label="Unsubscribe from select teams accordion section"
                >
                    <Accordion.Heading>
                        <Accordion.Trigger>Unsubscribe per team</Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Body>
                    <p className="mb-4">
                        Select the teams that you would like to continue to
                        receive new depth chart email notifications for
                    </p>
                    <CheckboxGroup
                        defaultValue={[]}
                        value={selected}
                        onChange={setSelected}
                    >
                        {teamTitles.map((team) => {
                            return (
                                <Checkbox key={team.value} value={team.value}>
                                    {team.title}
                                </Checkbox>
                            )
                        })}
                    </CheckboxGroup>
                    <ButtonGroup className="my-4">
                        <Button
                            variant="secondary"
                            isDisabled={navigation.state !== 'idle'}
                            onPress={() => {
                                setSelected([])
                            }}
                        >
                            Clear
                        </Button>
                        <Button
                            variant="secondary"
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
                            variant="primary"
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
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            </Card.Content>
        </Card>
    )
}
