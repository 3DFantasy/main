import { resqueTask } from '~/resque/main.server'
import { parseApiTeamCheckAction } from '~/utils/parse/actions/api.teamCheck.server'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { TeamId } from '~/types'

export type TeamCheckActionData = {
    message?: string
    code?: number
    count: number
    api: 'teamCheck'
}

export const apiTeamCheckAction = async (
    request: Request,
    params: ActionFunctionArgs['params']
) => {
    let count = 0

    const formData = await request.formData()

    const form = parseApiTeamCheckAction({ formData })

    if (form.isErr) {
        return {
            message: form.error.message,
            code: form.error.code,
            count,
            api: 'teamCheck',
        }
    }

    for (let i = 1; i <= 9; i++) {
        const teamKey = `team${i}`
        if (
            form.value.teamCheck[teamKey as keyof typeof form.value.teamCheck]
        ) {
            count++
            resqueTask({
                job: 'teamCheck',
                teamCheckProps: {
                    teamId: i as TeamId,
                },
            })
        }
    }

    return {
        count,
        api: 'teamCheck',
    }
}
