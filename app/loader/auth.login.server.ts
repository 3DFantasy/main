import { redirect } from 'react-router'
import { getCurrentAccount } from '~/utils/auth/auth.server'

export type LoaderData = {
    nextUrl?: string
}

export const authLoginLoader = async (request: Request) => {
    const url = new URL(request.url)
    const nextUrl = url.searchParams.get('nextUrl')
    if (await getCurrentAccount(request)) throw redirect('/home')

    return { nextUrl }
}
