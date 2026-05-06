import { afterEach, describe, expect, it } from 'vitest'
import { createSignature } from './createSignature.server'

describe('createSignature', () => {
    const ORIGINAL_SECRET = process.env.APP_SECRET

    afterEach(() => {
        if (ORIGINAL_SECRET === undefined) {
            Reflect.deleteProperty(process.env, 'APP_SECRET')
        } else {
            process.env.APP_SECRET = ORIGINAL_SECRET
        }
    })

    it('returns a 64-char hex SHA-256 hex string when APP_SECRET is set', () => {
        process.env.APP_SECRET = 'shh'
        const sig = createSignature('payload')
        expect(sig).toMatch(/^[a-f0-9]{64}$/)
    })

    it('returns the same signature for the same input + secret', () => {
        process.env.APP_SECRET = 'shh'
        const a = createSignature('payload')
        const b = createSignature('payload')
        expect(a).toBe(b)
    })

    it('returns a different signature for a different secret', () => {
        process.env.APP_SECRET = 'first'
        const a = createSignature('payload')
        process.env.APP_SECRET = 'second'
        const b = createSignature('payload')
        expect(a).not.toBe(b)
    })

    it('returns an empty string when APP_SECRET is not set', () => {
        Reflect.deleteProperty(process.env, 'APP_SECRET')
        expect(createSignature('payload')).toBe('')
    })
})
