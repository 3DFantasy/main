import { LoaderFunctionArgs } from 'react-router'
import { db } from '~/lib/db.server'
import { authenticator } from '~/utils/auth/auth.server'

import type { DepthChart } from '@prisma/client'

export type LoaderData = {
	depthCharts: DepthChart[]
}

export const homeTeamIdYearLoader = async (request: Request, params: LoaderFunctionArgs['params']) => {
	await authenticator.isAuthenticated(request, {
		failureRedirect: '/auth/login',
	})

	const depthCharts = await db.depthChart.findMany({
		where: {
			year: Number(params.year),
			Team: {
				uuid: params.teamId,
			},
		},
		orderBy: {
			id: 'asc',
		},
	})

	return { depthCharts }
}
