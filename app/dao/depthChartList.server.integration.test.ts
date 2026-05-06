import '../../tests/helpers/integrationSetup'
import { describe, expect, it } from 'vitest'
import { compareDepthChartList } from './depthChartList.server'
import { createTestTeam } from '../../tests/helpers/factories'
import { getTestDb } from '../../tests/helpers/db'

describe('compareDepthChartList', () => {
    it('creates a new DepthChartList row when none exists', async () => {
        const team = await createTestTeam()
        const value = [{ title: 'Week 1', href: 'https://example.com/w1' }]

        const result = await compareDepthChartList({
            teamId: team.id,
            year: 2026,
            value,
        })

        expect(result.isOk).toBe(true)
        if (result.isOk) {
            expect(result.value.depthChartList.value).toEqual(value)
            expect(result.value.newDepthChart).toEqual(value[0])
        }

        const rows = await getTestDb().depthChartList.findMany({
            where: { teamId: team.id, year: 2026 },
        })
        expect(rows).toHaveLength(1)
    })

    it('detects a newly added depth chart against an existing list', async () => {
        const team = await createTestTeam()
        const initial = [{ title: 'Week 1', href: 'https://example.com/w1' }]
        await getTestDb().depthChartList.create({
            data: { teamId: team.id, year: 2026, value: JSON.stringify(initial) },
        })

        const updated = [
            ...initial,
            { title: 'Week 2', href: 'https://example.com/w2' },
        ]
        const result = await compareDepthChartList({
            teamId: team.id,
            year: 2026,
            value: updated,
        })

        expect(result.isOk).toBe(true)
        if (result.isOk) {
            expect(result.value.newDepthChart).toEqual(updated[1])
        }
    })

    it('returns no new depth chart when length is unchanged', async () => {
        const team = await createTestTeam()
        const initial = [{ title: 'Week 1', href: 'https://example.com/w1' }]
        await getTestDb().depthChartList.create({
            data: { teamId: team.id, year: 2026, value: JSON.stringify(initial) },
        })

        const result = await compareDepthChartList({
            teamId: team.id,
            year: 2026,
            value: initial,
        })

        expect(result.isOk).toBe(true)
        if (result.isOk) {
            expect(result.value.newDepthChart).toBeNull()
        }
    })
})
