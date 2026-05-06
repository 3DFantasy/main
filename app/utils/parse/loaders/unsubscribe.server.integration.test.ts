import '../../../../tests/helpers/integrationSetup'
import { describe, expect, it } from 'vitest'
import { parseUnsubscribeLoader } from './unsubscribe.server'
import {
    createTestAccount,
    createTestDepthChart,
} from '../../../../tests/helpers/factories'

describe('parseUnsubscribeLoader', () => {
    it('returns ok with both UUIDs when both rows exist', async () => {
        const { account } = await createTestAccount()
        const chart = await createTestDepthChart()

        const result = await parseUnsubscribeLoader({
            params: { account: account.uuid, depthChart: chart.uuid },
        })

        expect(result.isOk).toBe(true)
        if (result.isOk) {
            expect(result.value.accountUUID).toBe(account.uuid)
            expect(result.value.depthChartUUID).toBe(chart.uuid)
        }
    })

    it('returns 404 err when account UUID does not match a row', async () => {
        const chart = await createTestDepthChart()
        const result = await parseUnsubscribeLoader({
            params: {
                account: '00000000-0000-0000-0000-000000000000',
                depthChart: chart.uuid,
            },
        })
        expect(result.isErr).toBe(true)
        if (result.isErr) {
            expect(result.error.code).toBe(404)
            expect(result.error.message).toMatch(/account/i)
        }
    })

    it('returns 404 err when depthChart UUID does not match a row', async () => {
        const { account } = await createTestAccount()
        const result = await parseUnsubscribeLoader({
            params: {
                account: account.uuid,
                depthChart: '00000000-0000-0000-0000-000000000000',
            },
        })
        expect(result.isErr).toBe(true)
        if (result.isErr) {
            expect(result.error.code).toBe(404)
            expect(result.error.message).toMatch(/depthchart/i)
        }
    })

    it('rejects account first when both UUIDs are bad', async () => {
        const result = await parseUnsubscribeLoader({
            params: {
                account: '00000000-0000-0000-0000-000000000000',
                depthChart: '00000000-0000-0000-0000-000000000001',
            },
        })
        expect(result.isErr).toBe(true)
        if (result.isErr) expect(result.error.message).toMatch(/account/i)
    })
})
