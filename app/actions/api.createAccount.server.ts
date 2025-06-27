import type { ActionFunctionArgs } from '@remix-run/node'
import { db } from '~/lib/db.server'
import { generatePassword } from '~/utils/index.server'
import { parseApiCreateAccountAction } from '~/utils/parse/actions/api.createAccount.server'

import type { Account } from '~/lib/db.server'

export type CreateAccountActionData = {
	account?: Account
	message?: string
	code?: number
	plainText?: string
	api: 'createAccount'
}

export const apiCreateAccountAction = async (request: Request, params: ActionFunctionArgs['params']) => {
	const formData = await request.formData()

	const form = await parseApiCreateAccountAction({ formData })

	if (form.isErr) {
		return { ...form.error, api: 'createAccount' }
	}

	const generatedPassword = generatePassword({ length: 20 })

	console.log(generatedPassword)

	const createdAccount = await db.account.create({
		data: {
			email: form.value.email,
			password: generatedPassword.hash,
		},
	})
	console.log(createdAccount)

	return {
		code: 200,
		account: createdAccount,
		plainText: generatedPassword.plainText,
		api: 'createAccount',
	}
}
