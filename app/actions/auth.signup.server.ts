import { redirect } from 'react-router'
import {
    authenticator,
    commitUserSession,
} from '~/utils/auth/auth.server'

export type ActionData = {
    message?: string
    code?: number
}

export const authSignupAction = async (request: Request) => {
    const url = new URL(request.url)
    const nextUrl = url.searchParams.get('nextUrl')

    let account
    try {
        account = await authenticator.authenticate('signup', request)
    } catch (exception) {
        if (exception instanceof Response) throw exception
        if (exception instanceof Error) {
            return { message: exception.message, code: 402 }
        }
        return { message: 'Something went wrong', code: 500 }
    }

    const cookie = await commitUserSession(request, account)
    throw redirect(`/home${nextUrl ? `?nextUrl=${nextUrl}` : ''}`, {
        headers: { 'Set-Cookie': cookie },
    })
}
