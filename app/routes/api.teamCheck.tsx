import { ActionFunction } from '@remix-run/node'
import { apiTeamCheckAction } from '~/actions/api.teamCheck.server'

export const action: ActionFunction = async ({ request, params }) => {
    return apiTeamCheckAction(request, params)
}
