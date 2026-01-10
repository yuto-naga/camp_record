import CampsiteForm from '@/components/CampsiteForm'
import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Campsite } from '@/types/supabase'

export default async function EditCampsitePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: site } = await supabase
        .from('campsites')
        .select('*')
        .eq('id', id)
        .single()

    if (!site) {
        notFound()
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">キャンプ場記録を編集</h1>
            <CampsiteForm campsite={site as Campsite} />
        </div>
    )
}
