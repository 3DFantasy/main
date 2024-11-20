import bcryptjs from 'bcryptjs'
import { Authenticator, AuthorizationError } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { accountCreate, accountFindUniqueByEmail } from '~/dao'
import { sessionStorage } from '~/utils/auth/sessionStorage.server'

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
		throw new AuthorizationError()
	}

	const passwordsMatch = await bcryptjs.compare(password, account.password as string)
	if (!passwordsMatch) {
		// incorrect password
		throw new AuthorizationError()
	}
	return account
})

authenticator.use(loginFormStrategy, 'login')

const signUpFormStrategy = new FormStrategy(async ({ form }) => {
	const email = form.get('email') as string
	const password = form.get('password') as string

	const account = await accountCreate(email, password)

	if (!account) {
		// server error during signup
		throw new AuthorizationError()
	}

	return account
})

authenticator.use(signUpFormStrategy, 'signup')

export { authenticator }
