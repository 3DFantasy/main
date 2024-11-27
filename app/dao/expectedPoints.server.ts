import { db } from '~/lib/db.server'

export type ExpectedPointsCreateInput = {
	down: number
	distance: string
	yardLine: number | number[]
	value: number
}

export async function expectedPointsCreate({
	down,
	distance,
	value,
	yardLine,
}: ExpectedPointsCreateInput): Promise<typeof expectedPointsCreated> {
	const expectedPointsCreated = await db.expectedPoints.create({
		data: {
			down,
			distance,
			yardLine: JSON.stringify(yardLine),
			value,
		},
	})
	return expectedPointsCreated
}
