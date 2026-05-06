import { db } from '~/lib/db.server'
import { parseSettingsAccountAction } from '~/utils/parse/actions/settings.account.server'

import type { Account } from '~/types'

export type ActionData = {
    account?: Account
    message?: string
    code?: number
}

export const settingsAccountAction = async (request: Request) => {
    const formData = await request.formData()

    const form = await parseSettingsAccountAction({ formData })

    if (form.isErr) {
        return form.error
    }

    const account = await db.account.update({
        where: {
            email: form.value.email,
        },
        data: {
            password: form.value.newPasswordHash,
        },
    })

    if (!account) {
        return {
            message: `Something went wrong updating account for: ${form.value.email}`,
            code: 401,
        }
    }

    return {
        account,
        code: 200,
    }
}
