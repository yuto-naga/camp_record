import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Header from './Header'

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
}))

// Mock supabase client
const mockGetUser = vi.fn()
const mockSignOut = vi.fn()
vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({
        auth: {
            getUser: mockGetUser,
            signOut: mockSignOut,
        },
    }),
}))

describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders login link when user is NOT logged in', async () => {
        mockGetUser.mockResolvedValue({ data: { user: null } })

        render(<Header />)

        await waitFor(() => {
            expect(screen.getByText('ログイン')).toBeInTheDocument()
        })
        expect(screen.queryByText('ログアウト')).not.toBeInTheDocument()
    })

    it('renders user email and logout button when logged in', async () => {
        mockGetUser.mockResolvedValue({
            data: {
                user: { email: 'test@example.com' }
            }
        })

        render(<Header />)

        await waitFor(() => {
            expect(screen.getByText('test@example.com')).toBeInTheDocument()
            expect(screen.getByText('ログアウト')).toBeInTheDocument()
        })
        expect(screen.queryByText('ログイン')).not.toBeInTheDocument()
    })
})
