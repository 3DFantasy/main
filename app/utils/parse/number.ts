import Result, { err, ok } from 'true-myth/result'

import type { Error } from '~/types/index'

export function parseNumber(variable: string, number: any): Result<number | null, Error> {
	if (number === '') {
		return ok(null)
	} else if (isNaN(Number(number))) {
		return err({ message: `${variable} is not a number`, code: 401 })
	} else {
		return ok(Number(number))
	}
}
