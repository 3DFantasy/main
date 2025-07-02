import type { ActionFunctionArgs } from '@remix-run/node'
import { db } from '~/lib/db.server'
import { generatePassword, sendMail } from '~/utils/index.server'
import { parseApiCreateAccountAction } from '~/utils/parse/actions/api.createAccount.server'

import type { Account } from '~/lib/db.server'
import { getEmailTemplate } from '~/utils/m365/emailTemplate.server'

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

	const createdAccount = await db.account.create({
		data: {
			email: form.value.email,
			password: generatedPassword.hash,
		},
	})

	const firstDepthChart = await db.depthChart.findUniqueOrThrow({
		where: {
			id: 1,
		},
	})

	const emailTitle = `Account created`

	const sendMailResp = await sendMail({
		message: {
			subject: emailTitle,
			body: {
				content: getEmailTemplate({
					createAccountProps: {
						title: emailTitle,
						account: {
							uuid: createdAccount.uuid,
							plainText: generatedPassword.plainText,
						},
						depthChart: {
							uuid: firstDepthChart.uuid,
						},
					},
				}),
				contentType: 'HTML',
			},
			toRecipients: [{ emailAddress: { address: createdAccount.email } }],
			from: {
				emailAddress: {
					name: 'Test name',
					address: process.env.MICROSOFT_3DFANTASY_FROM_EMAIL,
				},
			},
		},
		saveToSentItems: 'true',
	})

	if (sendMailResp.isErr) {
		return {
			account: createdAccount,
			plainText: generatedPassword.plainText,
			...sendMailResp.error,
		}
	}

	return {
		code: 200,
		account: createdAccount,
		plainText: generatedPassword.plainText,
		api: 'createAccount',
	}
}
