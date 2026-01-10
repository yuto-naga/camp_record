export type Campsite = {
    id: string
    user_id: string
    name: string
    location: string | null
    visited_date: string | null // Supabase returns dates as strings
    price: number | null
    rating: number | null
    review: string | null
    surrounding_facilities: string | null
    status: 'visited' | 'wishlist'
    image_urls: string[] | null
    created_at: string
}
