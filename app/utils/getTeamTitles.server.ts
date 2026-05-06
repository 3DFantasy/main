export type TeamTitleObj = {
    value: string
    title: string
    abbr: string
}

export const getTeamTitles = (): TeamTitleObj[] => {
    return Array.from({ length: 9 }, (_, i) => {
        const teamNumber = i + 1
        return {
            value: `team${teamNumber}`,
            title: process.env[`TEAM_${teamNumber}_TITLE`] as string,
            abbr: process.env[`TEAM_${teamNumber}_ABBR`] as string,
        }
    })
}
