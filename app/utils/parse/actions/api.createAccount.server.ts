import Result, { err, ok } from 'true-myth/result'
import { db } from '~/lib/db.server'
import { parseEmail } from '../email'
import { parseFormData } from '../formData.server'

import type { Error } from '~/types'

export type ParseApiTeamCheckActionOutput = {
	email: string
}

export const parseApiCreateAccountAction = async ({
	formData,
}: {
	formData: FormData
}): Promise<Result<ParseApiTeamCheckActionOutput, Error>> => {
	const email = parseFormData(formData.get('email'), 'parseApiCreateAccountAction-email')

	if (email.isErr) {
		return err(email.error)
	}
	const isEmail = parseEmail(email.value)

	if (isEmail.isErr) {
		return err(isEmail.error)
	}

	const existingEmail = await db.account.findUnique({
		where: {
			email: email.value,
		},
	})

	if (existingEmail) {
		return err({
			message: 'Email already exists',
			code: 401,
		})
	}

	return ok({ email: email.value })
}
