import { redirect } from 'react-router'
import { requireAuth } from '~/utils/auth/auth.server'
import { getTeamTitles } from '~/utils/index.server'

import type { TeamTitleObj } from '~/utils/getTeamTitles.server'

export type LoaderData = {
    teamTitles: TeamTitleObj[]
}

export const adminLoader = async (request: Request) => {
    const account = await requireAuth(request)

    if (account.role !== 'ADMIN') {
        return redirect('/home')
    }

    const teamTitles = getTeamTitles()

    return {
        teamTitles,
    }
}
