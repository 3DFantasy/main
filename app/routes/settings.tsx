import { Listbox, ListboxItem } from '@heroui/react'
import { Outlet, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { settingsLoader } from '~/loader/settings.server'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import type { ReactElement } from 'react'
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

export const ListboxWrapper = ({ children }: { children: ReactElement }) => (
    <div className="w-full max-w-[260px] h-fit border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        {children}
    </div>
)

export type SettingsContext = {
    account: Account
}

export default function Settings() {
    const { account } = useLoaderData<LoaderData>()
    const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]))

    const settingsContext: SettingsContext = {
        account,
    }

    return (
        <div className="mt-4 flex flex-row">
            <ListboxWrapper>
                <Listbox
                    aria-label="Actions"
                    selectedKeys={selectedKeys}
                    selectionMode="single"
                    variant="flat"
                >
                    <ListboxItem
                        key="account"
                        href="/settings/account"
                        onPress={() => setSelectedKeys(new Set(['account']))}
                    >
                        Account
                    </ListboxItem>
                    <ListboxItem
                        key="notifications"
                        href="/settings/notifications"
                        onPress={() =>
                            setSelectedKeys(new Set(['notifications']))
                        }
                    >
                        Notifications
                    </ListboxItem>
                </Listbox>
            </ListboxWrapper>
            <div className="w-full px-3">
                <Outlet context={settingsContext} />
            </div>
        </div>
    )
}
