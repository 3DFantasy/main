import '../../tests/helpers/integrationSetup'
import { describe, expect, it } from 'vitest'
import { unsubscribeLoader } from './unsubscribe.account.depthChart.server'
import {
    createTestAccount,
    createTestDepthChart,
} from '../../tests/helpers/factories'

function makeRequest() {
    return new Request('http://localhost/unsubscribe/foo/bar')
}

describe('unsubscribeLoader', () => {
    it('returns the account and team titles when both UUIDs resolve', async () => {
        const { account } = await createTestAccount()
        const chart = await createTestDepthChart()

        const result = await unsubscribeLoader(makeRequest(), {
            account: account.uuid,
            depthChart: chart.uuid,
        })
        expect(result.account!.id).toBe(account.id)
        expect(result.teamTitles).toHaveLength(9)
        expect(result.message).toBeUndefined()
    })

    it('returns a 404 message when the account UUID is invalid', async () => {
        const chart = await createTestDepthChart()
        const result = await unsubscribeLoader(makeRequest(), {
            account: '00000000-0000-0000-0000-000000000000',
            depthChart: chart.uuid,
        })
        expect(result.message).toMatch(/account/i)
        expect(result.code).toBe(404)
    })

    it('returns a 404 message when the depthChart UUID is invalid', async () => {
        const { account } = await createTestAccount()
        const result = await unsubscribeLoader(makeRequest(), {
            account: account.uuid,
            depthChart: '00000000-0000-0000-0000-000000000000',
        })
        expect(result.message).toMatch(/depthchart/i)
        expect(result.code).toBe(404)
    })
})
