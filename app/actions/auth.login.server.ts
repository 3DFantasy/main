import { ActionFunctionArgs } from '@remix-run/node'
import { AuthorizationError } from 'remix-auth'
import { authenticator } from '~/utils/auth/auth.server'

export type ActionData = {
    message: string
    code: number
}

export const authLoginAction = async (
    request: Request,
    params?: ActionFunctionArgs['params']
) => {
    const url = new URL(request.url)
    const nextUrl = url.searchParams.get('nextUrl')

    try {
        await authenticator.authenticate('login', request, {
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
