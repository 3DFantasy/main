export type TeamCheckBoxObj = {
	value: string
	title: string
}

export const getTeamCheckBoxes = (): TeamCheckBoxObj[] => {
	return Array.from({ length: 9 }, (_, i) => {
		const teamNumber = i + 1
		return {
			value: `team${teamNumber}`,
			title: process.env[`TEAM_${teamNumber}_TITLE`] as string,
		}
	})
}
