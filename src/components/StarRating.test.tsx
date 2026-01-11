import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StarRating from './StarRating'

describe('StarRating', () => {
    it('renders correct number of stars', () => {
        const { container } = render(<StarRating rating={3} />)
        expect(container.textContent).toBe('★★★☆☆')
        expect(screen.getByLabelText('評価: 3 / 5')).toBeInTheDocument()
    })

    it('renders null if rating is 0 or less', () => {
        const { container } = render(<StarRating rating={0} />)
        expect(container.firstChild).toBeNull()
    })

    it('handles maxRating prop', () => {
        const { container } = render(<StarRating rating={2} maxRating={3} />)
        expect(container.textContent).toBe('★★☆')
    })
})
