import bcryptjs from 'bcryptjs'
import { Authenticator, AuthorizationError } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { accountCreate, accountFindUniqueByEmail } from '~/dao'
import { sessionStorage } from '~/utils/auth/sessionStorage.server'
import { parseEmail } from '../parse'

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
	throw new Error('SESSION_SECRET must be set')
}

const authenticator = new Authenticator<any>(sessionStorage)

const loginFormStrategy = new FormStrategy(async ({ form }) => {
	const email = form.get('email') as string
	const password = form.get('password') as string

	const account = await accountFindUniqueByEmail(email)
	if (!account) {
		// credentials not found
		throw new AuthorizationError('Incorrect credentials, please try again')
	}

	const passwordsMatch = await bcryptjs.compare(password, account.password as string)
	if (!passwordsMatch) {
		// incorrect password
		throw new AuthorizationError('Incorrect credentials, please try again')
	}
	return account
})

authenticator.use(loginFormStrategy, 'login')

const signUpFormStrategy = new FormStrategy(async ({ form }) => {
	const email = form.get('email') as string
	const password = form.get('password') as string

	const existingAccount = await accountFindUniqueByEmail(email)

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

	const account = await accountCreate(email, password)

	if (!account) {
		// server error during signup
		throw new AuthorizationError('Something went wrong creating account')
	}

	return account
})

authenticator.use(signUpFormStrategy, 'signup')

export { authenticator }
