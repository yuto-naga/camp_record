import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DashboardClient from './DashboardClient'
import { Campsite } from '@/types/supabase'

// Mock next/link
vi.mock('next/link', () => {
    return {
        default: ({ children, href }: { children: React.ReactNode, href: string }) => (
            <a href={href}>{children}</a>
        ),
    }
})

const mockVisited: Campsite[] = [
    {
        id: '1',
        name: 'ふもとっぱら',
        location: '静岡県',
        review: '最高でした',
        status: 'visited',
        user_id: 'u1',
        created_at: '',
        image_urls: [],
        visited_date: '2023-01-01',
        price: 5000,
        rating: 5,
        surrounding_facilities: ''
    },
    {
        id: '2',
        name: 'ほったらかし',
        location: '山梨県',
        review: '温泉がよかった',
        status: 'visited',
        user_id: 'u1',
        created_at: '',
        image_urls: [],
        visited_date: '2023-02-01',
        price: 4000,
        rating: 4,
        surrounding_facilities: '温泉'
    }
]

const mockWishlist: Campsite[] = [
    {
        id: '3',
        name: '浩庵',
        location: '山梨県',
        review: '',
        status: 'wishlist',
        user_id: 'u1',
        created_at: '',
        image_urls: [],
        visited_date: null,
        price: null,
        rating: null,
        surrounding_facilities: ''
    }
]

describe('DashboardClient', () => {
    it('renders the dashboard with campsite lists', () => {
        render(
            <DashboardClient
                visitedCampsites={mockVisited}
                wishlistCampsites={mockWishlist}
            />
        )

        expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
        expect(screen.getByText('ふもとっぱら')).toBeInTheDocument()
        expect(screen.getByText('ほったらかし')).toBeInTheDocument()
        expect(screen.getByText('浩庵')).toBeInTheDocument()
    })

    it('filters campsites by search text', () => {
        render(
            <DashboardClient
                visitedCampsites={mockVisited}
                wishlistCampsites={mockWishlist}
            />
        )

        const searchInput = screen.getByPlaceholderText('キーワードで検索 (場所、名前など)...')

        // Search for "ふもと"
        fireEvent.change(searchInput, { target: { value: 'ふもと' } })

        expect(screen.getByText('ふもとっぱら')).toBeInTheDocument()
        expect(screen.queryByText('ほったらかし')).not.toBeInTheDocument()
        expect(screen.queryByText('浩庵')).not.toBeInTheDocument()
    })

    it('filters by location', () => {
        render(
            <DashboardClient
                visitedCampsites={mockVisited}
                wishlistCampsites={mockWishlist}
            />
        )

        const searchInput = screen.getByPlaceholderText('キーワードで検索 (場所、名前など)...')

        // Search for "山梨"
        fireEvent.change(searchInput, { target: { value: '山梨' } })

        expect(screen.queryByText('ふもとっぱら')).not.toBeInTheDocument()
        expect(screen.getByText('ほったらかし')).toBeInTheDocument()
        expect(screen.getByText('浩庵')).toBeInTheDocument()
    })

    it('shows "not found" message when no match', () => {
        render(
            <DashboardClient
                visitedCampsites={mockVisited}
                wishlistCampsites={mockWishlist}
            />
        )

        const searchInput = screen.getByPlaceholderText('キーワードで検索 (場所、名前など)...')
        fireEvent.change(searchInput, { target: { value: '存在しないキャンプ場' } })

        expect(screen.getAllByText('条件に一致する記録が見つかりませんでした。')).toHaveLength(2)
    })
})
