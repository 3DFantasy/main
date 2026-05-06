import { describe, expect, it } from 'vitest'
import { getDepthChartInfo } from './getDepthChartInfo.server'

describe('getDepthChartInfo', () => {
    it('returns pre-season for January 1', () => {
        const info = getDepthChartInfo(new Date(2026, 0, 1))
        expect(info.season).toBe('pre')
        expect(info.week).toBeGreaterThanOrEqual(1)
    })

    it('returns regular season for June 5', () => {
        const info = getDepthChartInfo(new Date(2026, 5, 5))
        expect(info.season).toBe('regular')
    })

    it('returns regular season for October 31', () => {
        const info = getDepthChartInfo(new Date(2026, 9, 31))
        expect(info.season).toBe('regular')
    })

    it('returns post-season for December 15', () => {
        const info = getDepthChartInfo(new Date(2026, 11, 15))
        expect(info.season).toBe('post')
    })

    it('week is at least 1 in every season', () => {
        for (const d of [
            new Date(2026, 0, 1),
            new Date(2026, 5, 5),
            new Date(2026, 9, 31),
            new Date(2026, 11, 15),
        ]) {
            expect(getDepthChartInfo(d).week).toBeGreaterThanOrEqual(1)
        }
    })
})
