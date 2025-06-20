import Result, { err, ok } from 'true-myth/result'
import { client } from '~/utils/m365/client.server'

import type { Error } from '~/types'

type EmailAddressObj = {
	emailAddress: {
		address: string
	}
}

export type SendMailInput = {
	message: {
		subject: string
		body: {
			contentType: 'Text' | 'HTML'
			content: string
		}
		toRecipients: EmailAddressObj[]
		ccRecipients?: EmailAddressObj[]
	}
	saveToSentItems: 'false' | 'true'
}

export type SendMailResponse = {
	success: boolean
}

type MicrosoftGraphSendMailResponse = {
	status: number
	body: {
		error: {
			code: string
			message: string
		}
	}
}

export async function sendMail({
	message,
	saveToSentItems,
}: SendMailInput): Promise<Result<SendMailResponse, Error>> {
	const sendMail = {
		message,
		saveToSentItems,
	}

	try {
		await client.api(`users/${process.env.MICROSOFT_3DFANTASY_FROM_EMAIL}/sendMail`).post(sendMail)

		return ok({ success: true })
	} catch (e) {
		return err({ message: `Something went wrong sending email: ${e}`, code: 500 })
	}
}
