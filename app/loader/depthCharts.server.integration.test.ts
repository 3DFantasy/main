import '../../tests/helpers/integrationSetup'
import { describe, expect, it } from 'vitest'
import { depthChartsLoader } from './depthCharts.server'
import {
    createTestAccount,
    createTestTeam,
} from '../../tests/helpers/factories'
import { authedRequest } from '../../tests/helpers/session'

describe('depthChartsLoader', () => {
    it('returns the team list for an authenticated user', async () => {
        const { account } = await createTestAccount()
        for (let i = 1; i <= 9; i++) await createTestTeam(i)

        const req = await authedRequest('http://localhost/depth-charts', account)
        const result = await depthChartsLoader(req)

        expect(result.teams).toHaveLength(9)
        for (const team of result.teams) {
            expect(team).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    uuid: expect.any(String),
                    title: expect.any(String),
                    abbr: expect.any(String),
                })
            )
        }
    })

    it('returns an empty team list when no teams exist', async () => {
        const { account } = await createTestAccount()
        const req = await authedRequest('http://localhost/depth-charts', account)
        const result = await depthChartsLoader(req)
        expect(result.teams).toHaveLength(0)
    })
})
