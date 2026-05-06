import { getCurrentAccount } from '~/utils/auth/auth.server'

import type { AuthAccount } from '~/utils/auth/auth.server'

export type LoaderData = {
    account: AuthAccount | null
}

export const indexLoader = async (request: Request) => {
    const account = await getCurrentAccount(request)

    return {
        account,
    }
}
