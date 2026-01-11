import { expect, test, describe } from 'vitest'
import { cn, formatDate } from '@/lib/utils'

describe('cn utility', () => {
    test('merges class names correctly', () => {
        const result = cn('c-btn', 'c-btn--primary')
        expect(result).toBe('c-btn c-btn--primary')
    })

    test('handles conditional classes', () => {
        const isActive = true
        const isDisabled = false
        const result = cn(
            'c-btn',
            isActive && 'is-active',
            isDisabled && 'is-disabled'
        )
        expect(result).toBe('c-btn is-active')
    })

    test('merges tailwind classes properly using tailwind-merge', () => {
        // p-4 should overwrite p-2
        const result = cn('p-2', 'p-4')
        expect(result).toBe('p-4')
    })
})

describe('formatDate utility', () => {
    test('formats valid date string to yyyy/mm/dd', () => {
        expect(formatDate('2023-01-01')).toBe('2023/01/01')
        expect(formatDate('2023/12/31')).toBe('2023/12/31')
    })

    test('returns empty string for null/undefined', () => {
        expect(formatDate(null)).toBe('')
        expect(formatDate(undefined)).toBe('')
    })

    test('returns original string for invalid date', () => {
        expect(formatDate('not-a-date')).toBe('not-a-date')
    })
})

describe('formatDate utility', () => {
    test('formats valid date string to yyyy/mm/dd', () => {
        expect(cn(formatDate('2023-01-01'))).toBe('2023/01/01')
        expect(cn(formatDate('2023/12/31'))).toBe('2023/12/31')
    })

    test('returns empty string for null/undefined', () => {
        expect(formatDate(null)).toBe('')
        expect(formatDate(undefined)).toBe('')
    })

    test('returns original string for invalid date', () => {
        expect(formatDate('not-a-date')).toBe('not-a-date')
    })
})
