import { describe, expect, it } from 'vitest'
import { parseApiTeamCheckAction } from './api.teamCheck.server'

function buildFormData(entries: Record<string, string>): FormData {
    const fd = new FormData()
    for (const [k, v] of Object.entries(entries)) fd.set(k, v)
    return fd
}

describe('parseApiTeamCheckAction', () => {
    it('marks all 9 teams true when every key is "true"', () => {
        const fd = buildFormData(
            Object.fromEntries(
                Array.from({ length: 9 }, (_, i) => [`team${i + 1}`, 'true'])
            )
        )
        const result = parseApiTeamCheckAction({ formData: fd })
        expect(result.isOk).toBe(true)
        if (!result.isOk) return
        for (let i = 1; i <= 9; i++) {
            expect(
                result.value.teamCheck[`team${i}` as keyof typeof result.value.teamCheck]
            ).toBe(true)
        }
    })

    it('marks only the keys provided as "true"', () => {
        const fd = buildFormData({ team1: 'true', team5: 'true', team9: 'true' })
        const result = parseApiTeamCheckAction({ formData: fd })
        expect(result.isOk).toBe(true)
        if (!result.isOk) return
        const tc = result.value.teamCheck
        expect(tc.team1).toBe(true)
        expect(tc.team5).toBe(true)
        expect(tc.team9).toBe(true)
        expect(tc.team2).toBe(false)
        expect(tc.team3).toBe(false)
        expect(tc.team4).toBe(false)
        expect(tc.team6).toBe(false)
        expect(tc.team7).toBe(false)
        expect(tc.team8).toBe(false)
    })

    it('defaults all 9 teams to false when no entries are provided', () => {
        const result = parseApiTeamCheckAction({ formData: new FormData() })
        expect(result.isOk).toBe(true)
        if (!result.isOk) return
        for (let i = 1; i <= 9; i++) {
            expect(
                result.value.teamCheck[`team${i}` as keyof typeof result.value.teamCheck]
            ).toBe(false)
        }
    })

    it('treats values other than "true" as false', () => {
        const fd = buildFormData({ team1: 'yes', team2: '1', team3: 'TRUE' })
        const result = parseApiTeamCheckAction({ formData: fd })
        expect(result.isOk).toBe(true)
        if (!result.isOk) return
        expect(result.value.teamCheck.team1).toBe(false)
        expect(result.value.teamCheck.team2).toBe(false)
        expect(result.value.teamCheck.team3).toBe(false)
    })
})
