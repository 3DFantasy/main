import { apiTeamCheckAction } from '~/actions/api.teamCheck.server'

import type { Route } from './+types/api.teamCheck'

export async function action({ request }: Route.ActionArgs) {
    return apiTeamCheckAction(request)
}
