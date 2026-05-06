import { default as bcrypt, default as bcryptjs } from 'bcryptjs'
import { redirect } from 'react-router'
import { Authenticator } from 'remix-auth'
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

// remix-auth v4: Authenticator no longer takes sessionStorage; the caller manages
// the session/cookie write after a successful authenticate() call.
const authenticator = new Authenticator<AuthAccount>()

const loginFormStrategy = new FormStrategy(async ({ form }) => {
    const email = form.get('email') as string
    const password = form.get('password') as string

    const account = await db.account.findUnique({
        where: { email: email },
    })
    if (!account) {
        // credentials not found
        throw new Error('Incorrect credentials, please try again')
    }

    const passwordsMatch = await bcryptjs.compare(
        password,
        account.password as string
    )
    if (!passwordsMatch) {
        throw new Error('Incorrect credentials, please try again')
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
        select: { id: true, email: true, uuid: true, role: true },
    })

    if (existingAccount) {
        throw new Error('Account with that email already exists, login instead?')
    }

    const isEmail = parseEmail(email)
    if (isEmail.isErr) {
        throw new Error('Not a valid email, try a different one')
    }

    if (password.length <= 7) {
        throw new Error('Password must be 8 characters in length')
    }

    const salt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(password, salt)
    const account = await db.account.create({
        data: { email, password: passwordHash },
    })

    if (!account) {
        throw new Error('Something went wrong creating account')
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

// Helpers that replace the v3 isAuthenticated patterns. Kept here so the v4
// "manage session yourself" idiom lives in one place rather than every loader.

const SESSION_USER_KEY = 'user'

export async function getCurrentAccount(
    request: Request
): Promise<AuthAccount | null> {
    const session = await sessionStorage.getSession(
        request.headers.get('cookie')
    )
    return (session.get(SESSION_USER_KEY) as AuthAccount | undefined) ?? null
}

export async function requireAuth(request: Request): Promise<AuthAccount> {
    const account = await getCurrentAccount(request)
    if (!account) throw redirect('/auth/login')
    return account
}

// Sets the user in the session and returns the Set-Cookie header value.
// Callers throw a Response that includes this header to commit the login.
export async function commitUserSession(
    request: Request,
    account: AuthAccount
): Promise<string> {
    const session = await sessionStorage.getSession(
        request.headers.get('cookie')
    )
    session.set(SESSION_USER_KEY, account)
    return await sessionStorage.commitSession(session)
}

// Destroys the session and returns the Set-Cookie header value clearing it.
export async function destroyUserSession(request: Request): Promise<string> {
    const session = await sessionStorage.getSession(
        request.headers.get('cookie')
    )
    return await sessionStorage.destroySession(session)
}
