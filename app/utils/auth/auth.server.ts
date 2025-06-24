import { default as bcrypt, default as bcryptjs } from 'bcryptjs'
import { Authenticator, AuthorizationError } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'

import { db } from '~/lib/db.server'
import { sessionStorage } from '~/utils/auth/sessionStorage.server'
import { parseEmail } from '../parse'

export type AuthAccount = {
	id: number
	uuid: string
	email: string
	role: 'ADMIN' | 'USER'
}

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
	throw new Error('SESSION_SECRET must be set')
}

const authenticator = new Authenticator<any>(sessionStorage)

const loginFormStrategy = new FormStrategy(async ({ form }) => {
	const email = form.get('email') as string
	const password = form.get('password') as string

	const account = await db.account.findUnique({
		where: { email: email },
	})
	if (!account) {
		// credentials not found
		throw new AuthorizationError('Incorrect credentials, please try again')
	}

	const passwordsMatch = await bcryptjs.compare(password, account.password as string)
	if (!passwordsMatch) {
		// incorrect password
		throw new AuthorizationError('Incorrect credentials, please try again')
	}
	return {
		id: account.id,
		uuid: account.uuid,
		email: account.email,
		role: account.role,
	} as AuthAccount
})

authenticator.use(loginFormStrategy, 'login')

const signUpFormStrategy = new FormStrategy(async ({ form }) => {
	const email = form.get('email') as string
	const password = form.get('password') as string

	const existingAccount = await db.account.findUnique({
		where: { email: email },
		select: {
			id: true,
			email: true,
			uuid: true,
			role: true,
		},
	})

	if (existingAccount) {
		// existing email
		throw new AuthorizationError('Account with that email already exists, login instead?')
	}

	const isEmail = parseEmail(email)

	if (isEmail.isErr) {
		// not a valid email
		throw new AuthorizationError('Not a valid email, try a different one')
	}

	if (password.length <= 7) {
		// password length
		throw new AuthorizationError('Password must be 8 characters in length')
	}

	const salt = bcrypt.genSaltSync(10)
	const passwordHash = bcrypt.hashSync(password, salt)
	const account = await db.account.create({
		data: {
			email: email,
			password: passwordHash,
		},
	})

	if (!account) {
		// server error during signup
		throw new AuthorizationError('Something went wrong creating account')
	}

	return {
		id: account.id,
		uuid: account.uuid,
		email: account.email,
		role: account.role,
	} as AuthAccount
})

authenticator.use(signUpFormStrategy, 'signup')

export { authenticator }
