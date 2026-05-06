import { ActionFunction } from '@remix-run/node'
import { apiTeamCheckAction } from '~/actions/api.teamCheck.server'

export const action: ActionFunction = async ({ request }) => {
    return apiTeamCheckAction(request)
}
