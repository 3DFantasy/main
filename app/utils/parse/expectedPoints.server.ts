import { expectedPointsCreate, playFindMany } from '~/dao/index.server'

export type CalculateExpectedPointsInput = {
	down: number
	distance: string
	yardLine: number | number[]
}
export async function calculateExpectedPoints({
	down,
	distance,
	yardLine,
}: CalculateExpectedPointsInput) {
	const points: number[] = []

	const plays = await playFindMany({
		where: {
			down,
			distance,
			yardLine: yardLine,
		},
	})

	for (const play of plays) {
		if (play.Drive.nextPointOutcome !== null) {
			points.push(play.Drive.nextPointOutcome)
		}
	}
	const sum = points.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
	console.log('-------')
	console.log(`${down} & ${distance} at ${yardLine}`)
	console.log(`[${yardLine}]`)
	console.log('totalPlays', plays.length)

	const value = Number((sum / plays.length).toFixed(2))
	console.log('value', value)

	const createdExpectedPoints = await expectedPointsCreate({
		down,
		distance,
		value,
		yardLine,
	})

	console.log(`EP: ${createdExpectedPoints.value}`)
}
