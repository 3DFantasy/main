import { db } from '~/lib/db.server'
import { getCurrentAccount } from '~/utils/auth/auth.server'
import { getTeamTitles } from '~/utils/getTeamTitles.server'

export type LoaderData = {
    teams: {
        id: number
        uuid: string
        title: string
        abbr: string
        key: string
    }[]
}

export const depthChartsLoader = async (request: Request) => {
    await getCurrentAccount(request)

    const teams = await db.team.findMany({
        select: {
            id: true,
            uuid: true,
        },
    })
    const teamTitles = getTeamTitles()

    return {
        teams: teams.map((team) => {
            const teamTitle = teamTitles.filter((teamTitle) => {
                return teamTitle.value.includes(team.id.toString())
            })[0]
            return {
                id: team.id,
                uuid: team.uuid,
                title: teamTitle.title,
                abbr: teamTitle.abbr,
                key: teamTitle.value,
            }
        }),
    }
}
