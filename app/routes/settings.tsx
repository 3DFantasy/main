import { Card, CardBody, Tab, Tabs } from '@heroui/react'
import { Outlet, useLoaderData, useLocation, useNavigate } from '@remix-run/react'
import { settingsLoader } from '~/loader/settings.server'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import type { LoaderData } from '~/loader/settings.server'
import type { Account } from '~/types'

export const meta: MetaFunction = () => {
    return [
        { title: '3DF - Settings' },
        { name: '3DF', content: 'Modify your 3DF application settings' },
    ]
}

export const loader: LoaderFunction = async ({ request }) => {
    return settingsLoader(request)
}

export type SettingsContext = {
    account: Account
}

export default function Settings() {
    const { account } = useLoaderData<LoaderData>()
    const location = useLocation()
    const navigate = useNavigate()

    const settingsContext: SettingsContext = {
        account,
    }

    const selectedKey = location.pathname.includes('/settings/notifications')
        ? 'notifications'
        : 'account'

    return (
        <Card className="mt-4">
            <CardBody>
                <Tabs
                    selectedKey={selectedKey}
                    onSelectionChange={(key) => navigate(`/settings/${key}`)}
                    variant="underlined"
                    aria-label="Settings tabs"
                >
                    <Tab key="account" title="Account" />
                    <Tab key="notifications" title="Notifications" />
                </Tabs>
                <div className="mt-4">
                    <Outlet context={settingsContext} />
                </div>
            </CardBody>
        </Card>
    )
}
