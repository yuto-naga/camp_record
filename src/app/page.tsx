import { createClient } from '@/utils/supabase/server'
import DashboardClient from '@/components/DashboardClient'

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: visitedCampsites } = await supabase
    .from('campsites')
    .select('*')
    .eq('status', 'visited')
    .order('visited_date', { ascending: false })

  const { data: wishlistCampsites } = await supabase
    .from('campsites')
    .select('*')
    .eq('status', 'wishlist')
    .order('created_at', { ascending: false })

  return (
    <DashboardClient
      visitedCampsites={visitedCampsites}
      wishlistCampsites={wishlistCampsites}
    />
  )
}
