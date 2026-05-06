import { apiCreateAccountAction } from '~/actions/api.createAccount.server'

import type { Route } from './+types/api.createAccount'

export async function action({ request }: Route.ActionArgs) {
    return apiCreateAccountAction(request)
}
