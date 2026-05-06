import { ActionFunction } from '@remix-run/node'
import { apiCreateAccountAction } from '~/actions/api.createAccount.server'

export const action: ActionFunction = async ({ request }) => {
    return apiCreateAccountAction(request)
}
