import crypto from 'crypto'

export const createSignature = (body: string) => {
	if (process.env.APP_SECRET) {
		const appSecret = process.env.APP_SECRET
		const signature = crypto.createHmac('sha256', appSecret).update(body).digest('hex')
		return signature
	} else {
		console.log('APP Secret not set')
		return ''
	}
}
