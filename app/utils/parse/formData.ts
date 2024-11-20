import Result, { err, ok } from 'true-myth/result'
import { parseNumber } from '~/utils/parse/number'

import type { Error } from '~/types/index'

export function parseFormData(
	value: FormDataEntryValue | null,
	variable: string,
	number?: boolean
): Result<any, Error> {
	if (number) {
		const parsedNumber = parseNumber(variable, value)
		if (parsedNumber.isOk) {
			return ok(parsedNumber.value as number)
		} else {
			return err({ message: parsedNumber.error.message, code: parsedNumber.error.code })
		}
	} else if (typeof value === 'bigint') {
		return ok(value as bigint)
	} else if (typeof value === 'function') {
		return ok(value as Function)
	} else if (typeof value === 'object') {
		return ok(value as object)
	} else if (typeof value === 'string') {
		if (value.length > 0) {
			if (value === 'null') {
				return ok(null)
			} else {
				return ok(value as string)
			}
		} else {
			return ok(null)
		}
	} else if (typeof value === 'symbol') {
		return ok(value as symbol)
	} else if (value === null) {
		return ok(value as object)
	} else {
		return err({ message: `Form data variable: ${variable}`, code: 500, name: 'parseFormData' })
	}
}
