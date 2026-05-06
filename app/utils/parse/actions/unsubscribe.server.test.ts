import { describe, expect, it } from 'vitest'
import { parseUnsubscribeAction } from './unsubscribe.server'

function fullPayload(overrides: Record<string, string> = {}): FormData {
    const fd = new FormData()
    fd.set('accountId', '1')
    for (let i = 1; i <= 9; i++) fd.set(`team${i}`, 'true')
    for (const [k, v] of Object.entries(overrides)) fd.set(k, v)
    return fd
}

describe('parseUnsubscribeAction', () => {
    it('parses a full payload of all-true team flags', () => {
        const result = parseUnsubscribeAction({ formData: fullPayload() })
        expect(result.isOk).toBe(true)
        if (!result.isOk) return
        expect(result.value.accountId).toBe(1)
        for (let i = 1; i <= 9; i++) {
            expect(result.value[`team${i}` as keyof typeof result.value]).toBe(true)
        }
    })

    it('parses a mix of true/false flags', () => {
        const fd = fullPayload({ team2: 'false', team5: 'false' })
        const result = parseUnsubscribeAction({ formData: fd })
        expect(result.isOk).toBe(true)
        if (!result.isOk) return
        expect(result.value.team1).toBe(true)
        expect(result.value.team2).toBe(false)
        expect(result.value.team5).toBe(false)
        expect(result.value.team9).toBe(true)
    })

    it('errors with 400 when accountId is missing', () => {
        const fd = new FormData()
        for (let i = 1; i <= 9; i++) fd.set(`team${i}`, 'false')
        const result = parseUnsubscribeAction({ formData: fd })
        expect(result.isErr).toBe(true)
        if (result.isErr) expect(result.error.code).toBe(400)
    })

    it('errors when a team flag has an unrecognized value', () => {
        const fd = fullPayload({ team3: 'maybe' })
        const result = parseUnsubscribeAction({ formData: fd })
        expect(result.isErr).toBe(true)
        if (result.isErr) expect(result.error.code).toBe(500)
    })

    it('coerces the accountId string to a number', () => {
        const fd = fullPayload({ accountId: '42' })
        const result = parseUnsubscribeAction({ formData: fd })
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(typeof result.value.accountId).toBe('number')
    })
})
