import { describe, expect, it } from 'vitest'
import { parseFormData, parseFormDataBool } from './formData.server'

describe('parseFormData', () => {
    it('returns ok(string) for a non-empty string', () => {
        const result = parseFormData('hello', 'field')
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value).toBe('hello')
    })

    it('returns ok(null) for an empty string', () => {
        const result = parseFormData('', 'field')
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value).toBeNull()
    })

    it('returns ok(null) for the literal string "null"', () => {
        const result = parseFormData('null', 'field')
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value).toBeNull()
    })

    it('returns ok(null) for null input', () => {
        const result = parseFormData(null, 'field')
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value).toBeNull()
    })

    it('returns ok(File) for a File value', () => {
        const file = new File(['x'], 'x.txt')
        const result = parseFormData(file, 'field')
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value).toBe(file)
    })

    describe('with number=true', () => {
        it('parses a numeric string', () => {
            const result = parseFormData('42', 'field', true)
            expect(result.isOk).toBe(true)
            if (result.isOk) expect(result.value).toBe(42)
        })

        it('errors on non-numeric input', () => {
            const result = parseFormData('banana', 'field', true)
            expect(result.isErr).toBe(true)
        })
    })
})

describe('parseFormDataBool', () => {
    it('returns ok(true) for "true"', () => {
        const result = parseFormDataBool('true', 'field')
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value).toBe(true)
    })

    it('returns ok(false) for "false"', () => {
        const result = parseFormDataBool('false', 'field')
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value).toBe(false)
    })

    it('returns ok(false) for null', () => {
        const result = parseFormDataBool(null, 'field')
        expect(result.isOk).toBe(true)
        if (result.isOk) expect(result.value).toBe(false)
    })

    it('returns err for any other string', () => {
        const result = parseFormDataBool('maybe', 'field')
        expect(result.isErr).toBe(true)
        if (result.isErr) expect(result.error.code).toBe(500)
    })
})
