import { AuthorizationError } from 'remix-auth'
import { authenticator } from '~/utils/auth/auth.server'

export type ActionData = {
    message?: string
    code?: number
}

export const authSignupAction = async (request: Request) => {
    const url = new URL(request.url)
    const nextUrl = url.searchParams.get('nextUrl')

    try {
        return await authenticator.authenticate('signup', request, {
            successRedirect: `/home${nextUrl ? `?nextUrl=${nextUrl}` : ''}`,
            throwOnError: true,
        })
    } catch (exception) {
        if (exception instanceof Response) {
            throw exception
        }
        if (exception instanceof AuthorizationError) {
            return {
                message: exception.message,
                code: 402,
            }
        }
    }
    return {
        message: 'Something went wrong',
        code: 500,
    }
}
