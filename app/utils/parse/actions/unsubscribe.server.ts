import Result, { err, ok } from 'true-myth/result'
import { parseFormData, parseFormDataBool } from '../formData.server'

import type { Error } from '~/types'

export type ParseUnsubscribeOutput = {
	accountId: number
	team1: boolean
	team2: boolean
	team3: boolean
	team4: boolean
	team5: boolean
	team6: boolean
	team7: boolean
	team8: boolean
	team9: boolean
}

export const parseUnsubscribeAction = ({
	formData,
}: {
	formData: FormData
}): Result<ParseUnsubscribeOutput, Error> => {
	const accountId = parseFormData(formData.get('accountId'), 'parseUnsubscribeAction-accountId')
	const team1 = parseFormDataBool(formData.get('team1'), 'parseUnsubscribeAction-team1')
	const team2 = parseFormDataBool(formData.get('team2'), 'parseUnsubscribeAction-team1')
	const team3 = parseFormDataBool(formData.get('team3'), 'parseUnsubscribeAction-team1')
	const team4 = parseFormDataBool(formData.get('team4'), 'parseUnsubscribeAction-team1')
	const team5 = parseFormDataBool(formData.get('team5'), 'parseUnsubscribeAction-team1')
	const team6 = parseFormDataBool(formData.get('team6'), 'parseUnsubscribeAction-team1')
	const team7 = parseFormDataBool(formData.get('team7'), 'parseUnsubscribeAction-team1')
	const team8 = parseFormDataBool(formData.get('team8'), 'parseUnsubscribeAction-team1')
	const team9 = parseFormDataBool(formData.get('team9'), 'parseUnsubscribeAction-team1')

	if (
		accountId.isErr ||
		team1.isErr ||
		team2.isErr ||
		team3.isErr ||
		team4.isErr ||
		team5.isErr ||
		team6.isErr ||
		team7.isErr ||
		team8.isErr ||
		team9.isErr
	) {
		return err({
			message: `Error parsing unsubscribe action formData`,
			code: 500,
		})
	}

	if (!accountId.value) {
		return err({
			message: `No accountID included in formData`,
			code: 400,
		})
	}

	return ok({
		accountId: Number(accountId.value),
		team1: team1.value,
		team2: team2.value,
		team3: team3.value,
		team4: team4.value,
		team5: team5.value,
		team6: team6.value,
		team7: team7.value,
		team8: team8.value,
		team9: team9.value,
	})
}
