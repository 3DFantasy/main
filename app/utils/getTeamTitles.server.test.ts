import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getTeamTitles } from './getTeamTitles.server'

describe('getTeamTitles', () => {
    const ORIGINAL = { ...process.env }

    beforeEach(() => {
        for (let i = 1; i <= 9; i++) {
            process.env[`TEAM_${i}_TITLE`] = `Team ${i}`
            process.env[`TEAM_${i}_ABBR`] = `T${i}`
        }
    })

    afterEach(() => {
        for (const k of Object.keys(process.env)) {
            if (k.startsWith('TEAM_')) Reflect.deleteProperty(process.env, k)
        }
        for (const [k, v] of Object.entries(ORIGINAL)) {
            if (k.startsWith('TEAM_') && v !== undefined) process.env[k] = v
        }
    })

    it('returns 9 entries shaped { value, title, abbr }', () => {
        const titles = getTeamTitles()
        expect(titles).toHaveLength(9)
        for (let i = 0; i < 9; i++) {
            expect(titles[i]).toEqual({
                value: `team${i + 1}`,
                title: `Team ${i + 1}`,
                abbr: `T${i + 1}`,
            })
        }
    })

    it('returns undefined for fields whose env var is unset', () => {
        Reflect.deleteProperty(process.env, 'TEAM_3_TITLE')
        Reflect.deleteProperty(process.env, 'TEAM_7_ABBR')
        const titles = getTeamTitles()
        expect(titles[2].title).toBeUndefined()
        expect(titles[6].abbr).toBeUndefined()
        // Untouched fields still work.
        expect(titles[2].abbr).toBe('T3')
        expect(titles[6].title).toBe('Team 7')
    })
})
