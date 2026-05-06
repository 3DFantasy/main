import { authenticator } from '~/utils/auth/auth.server'

import type { AuthAccount } from '~/utils/auth/auth.server'

export type LoaderData = {
    account: AuthAccount | null
    nextUrl?: string
}

export const homeLoader = async (request: Request) => {
    const url = new URL(request.url)
    const nextUrl = url.searchParams.get('nextUrl')

    const account = await authenticator.isAuthenticated(request)

    return {
        account,
        nextUrl,
    }
}
