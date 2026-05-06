import { getCurrentAccount } from '~/utils/auth/auth.server'

export type LoaderData = {
    years: number[]
}

export const depthChartsTeamIdLoader = async (request: Request) => {
    await getCurrentAccount(request)

    return {
        years: [2024, 2025],
    }
}
