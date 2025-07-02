import { db } from '~/lib/db.server'
import { parseUnsubscribeAction } from '~/utils/parse/actions/unsubscribe.server'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { Account } from '~/types'

export type ActionData = {
	account: Account
	message?: string
	code?: number
}

export const unsubscribeAction = async (request: Request, params: ActionFunctionArgs['params']) => {
	const formData = await request.formData()

	const form = parseUnsubscribeAction({ formData })

	if (form.isErr) {
		return {
			message: form.error.message,
			code: form.error.code,
		}
	}

	const updatedAccount = await db.account.update({
		where: {
			id: form.value.accountId,
		},
		data: {
			team1Notification: form.value.team1,
			team2Notification: form.value.team2,
			team3Notification: form.value.team3,
			team4Notification: form.value.team4,
			team5Notification: form.value.team5,
			team6Notification: form.value.team6,
			team7Notification: form.value.team7,
			team8Notification: form.value.team8,
			team9Notification: form.value.team9,
		},
	})

	return {
		account: updatedAccount,
	}
}
