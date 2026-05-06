import { requireAuth } from '~/utils/auth/auth.server'

export const settingsAccountLoader = async (request: Request) => {
    await requireAuth(request)

    return {}
}
