import bcrypt from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { generatePassword } from './generatePassword.server'

describe('generatePassword', () => {
    it('returns a password of the default length when none is given', () => {
        const { plainText } = generatePassword({})
        expect(plainText).toHaveLength(16)
    })

    it('honors a custom length', () => {
        const { plainText } = generatePassword({ length: 24 })
        expect(plainText).toHaveLength(24)
    })

    it('always includes at least one uppercase, lowercase, digit, and special char', () => {
        // The first 4 chars are guaranteed by construction; sanity-check across runs.
        for (let i = 0; i < 20; i++) {
            const { plainText } = generatePassword({ length: 12 })
            expect(plainText).toMatch(/[A-Z]/)
            expect(plainText).toMatch(/[a-z]/)
            expect(plainText).toMatch(/[0-9]/)
            expect(plainText).toMatch(/[!@#$%^&*?]/)
        }
    })

    it('returns a bcrypt hash that verifies against the plaintext', () => {
        const { plainText, hash } = generatePassword({ length: 16 })
        expect(bcrypt.compareSync(plainText, hash)).toBe(true)
    })

    it('two calls return different plaintexts', () => {
        const a = generatePassword({ length: 16 })
        const b = generatePassword({ length: 16 })
        expect(a.plainText).not.toBe(b.plainText)
    })
})
