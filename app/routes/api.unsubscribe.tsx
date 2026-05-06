import { unsubscribeAction } from '~/actions/unsubscribe.server'

import type { Route } from './+types/api.unsubscribe'

export async function action({ request }: Route.ActionArgs) {
    return unsubscribeAction(request)
}
