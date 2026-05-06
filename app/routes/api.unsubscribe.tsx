import { ActionFunction } from '@remix-run/node'
import { unsubscribeAction } from '~/actions/unsubscribe.server'

export const action: ActionFunction = async ({ request }) => {
    return unsubscribeAction(request)
}
