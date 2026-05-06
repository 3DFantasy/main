import { sessionStorage } from '../../app/utils/auth/sessionStorage.server'

import type { Account } from '@prisma/client'

// Build a Cookie header that satisfies authenticator.isAuthenticated for the given account.
// remix-auth v3 stores the authenticated user under the session key `user`.
export async function authCookieFor(account: Account): Promise<string> {
    const session = await sessionStorage.getSession()
    session.set('user', {
        id: account.id,
        uuid: account.uuid,
        email: account.email,
        role: account.role,
    })
    return await sessionStorage.commitSession(session)
}

export async function authedRequest(
    url: string,
    account: Account,
    init?: RequestInit
): Promise<Request> {
    const cookie = await authCookieFor(account)
    return new Request(url, {
        ...init,
        headers: { ...(init?.headers ?? {}), Cookie: cookie },
    })
}
