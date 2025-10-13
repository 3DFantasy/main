import { db } from '~/lib/db.server'
import { authenticator } from '~/utils/auth/auth.server'

import type { Account } from '~/types'
import type { AuthAccount } from '~/utils/auth/auth.server'

export type LoaderData = {
    account: Account
}

export const settingsLoader = async (request: Request) => {
    const authAccount: AuthAccount = await authenticator.isAuthenticated(
        request,
        {
            failureRedirect: '/auth/login',
        }
    )

    const account = await db.account.findUnique({
        where: { id: authAccount.id },
    })

    return {
        account,
    }
}
