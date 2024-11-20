import { db } from '../../lib/db'

export type TeamFindUniqueInput = {
	where: {
		id: number
	}
}

export async function teamFindUnique({ where }: TeamFindUniqueInput): Promise<typeof team> {
	const team = await db.team.findUnique({
		where: where,
		select: {
			id: true,
			depthChart: {
				select: {
					id: true,
					year: true,
					value: true,
				},
			},
		},
	})
	return team
}
