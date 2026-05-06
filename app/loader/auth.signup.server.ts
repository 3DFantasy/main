import { redirect } from 'react-router'
import { getCurrentAccount } from '~/utils/auth/auth.server'

export type LoaderData = {
    error: boolean
}

export const authSignupLoader = async (request: Request) => {
    const url = new URL(request.url)
    const error = url.searchParams.get('error')
    if (await getCurrentAccount(request)) throw redirect('/home')

    return { error: error === 'true' ? true : false }
}
