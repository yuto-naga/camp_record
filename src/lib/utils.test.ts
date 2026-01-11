import { expect, test, describe } from 'vitest'
import { cn } from '@/lib/utils'

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
