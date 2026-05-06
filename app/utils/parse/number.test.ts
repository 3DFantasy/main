import { describe, expect, it } from 'vitest'
import { parseNumber } from './number'

describe('parseNumber', () => {
    it('returns ok(null) for empty string', () => {
        const result = parseNumber('teamId', '')
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value).toBeNull()
    })

    it('returns ok(number) for a valid numeric string', () => {
        const result = parseNumber('teamId', '42')
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value).toBe(42)
    })

    it('returns ok(number) for a real number value', () => {
        const result = parseNumber('teamId', 7)
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value).toBe(7)
    })

    it('returns ok(0) for the string "0"', () => {
        const result = parseNumber('teamId', '0')
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value).toBe(0)
    })

    it('returns err for non-numeric input', () => {
        const result = parseNumber('teamId', 'banana')
        expect(result.isErr).toBe(true)
        if (result.isErr) {
            expect(result.error.message).toBe('teamId is not a number')
            expect(result.error.code).toBe(401)
        }
    })

    it('returns err for undefined', () => {
        const result = parseNumber('teamId', undefined)
        expect(result.isErr).toBe(true)
    })
})
