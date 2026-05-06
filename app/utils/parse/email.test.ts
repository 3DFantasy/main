import { describe, expect, it } from 'vitest'
import { parseEmail } from './email'

describe('parseEmail', () => {
    it.each([
        'user@example.com',
        'first.last@example.com',
        'user+tag@example.com',
        'user@sub.example.co.uk',
        'UPPER@EXAMPLE.COM',
        '0@a.bb',
    ])('accepts valid email: %s', (email) => {
        const result = parseEmail(email)
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value).toBe(email)
    })

    it.each([
        '',
        'no-at-sign',
        '@no-local.com',
        'no-domain@',
        'no-tld@example',
        'has space@example.com',
        'trailing@space .com',
    ])('rejects invalid email: %s', (email) => {
        const result = parseEmail(email)
        expect(result.isErr).toBe(true)
        if (result.isErr) {
            expect(result.error.message).toBe('Not a valid email')
            expect(result.error.code).toBe(401)
        }
    })
})
