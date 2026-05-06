import { redirect } from 'react-router'
import { db } from '~/lib/db.server'
import { requireAuth } from '~/utils/auth/auth.server'

import type { Account } from '~/types'

export type LoaderData = {
    account: Account
}

export const settingsLoader = async (request: Request) => {
    const authAccount = await requireAuth(request)

    const url = new URL(request.url)
    if (url.pathname === '/settings' || url.pathname === '/settings/') {
        throw redirect('/settings/account')
    }

    const account = await db.account.findUnique({
        where: { id: authAccount.id },
    })

    return {
        account,
    }
}
