import { requireAuth } from '~/utils/auth/auth.server'

export type LoaderData = {
    // account: TeamCheckBoxObj[]
}

export const settingsAccountLoader = async (request: Request) => {
    await requireAuth(request)

    return {
        // account
    }
}
