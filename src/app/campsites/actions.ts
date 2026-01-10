'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Campsite } from '@/types/supabase'

export async function createCampsite(formData: FormData) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const name = formData.get('name') as string
    const location = formData.get('location') as string
    const status = formData.get('status') as 'visited' | 'wishlist'
    const visited_date = formData.get('visited_date') as string || null
    const price = formData.get('price') ? parseInt(formData.get('price') as string) : null
    const rating = formData.get('rating') ? parseInt(formData.get('rating') as string) : null
    const review = formData.get('review') as string
    const surrounding_facilities = formData.get('surrounding_facilities') as string

    // Image handling
    const files = formData.getAll('images') as File[]
    const image_urls: string[] = []

    if (files && files.length > 0) {
        for (const file of files) {
            if (file.size === 0) continue

            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('campsite_images')
                .upload(fileName, file)

            if (uploadError) {
                console.error('Error uploading image:', uploadError)
                continue
            }

            const { data: { publicUrl } } = supabase.storage
                .from('campsite_images')
                .getPublicUrl(fileName)

            image_urls.push(publicUrl)
        }
    }

    const { error } = await supabase.from('campsites').insert({
        user_id: user.id,
        name,
        location,
        status,
        visited_date,
        price,
        rating,
        review,
        surrounding_facilities,
        image_urls
    })

    if (error) {
        console.error('Error creating campsite', error)
        throw new Error('Failed to create campsite')
    }

    revalidatePath('/')
    redirect('/')
}

export async function updateCampsite(formData: FormData) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const id = formData.get('id') as string
    if (!id) throw new Error('ID required')

    const name = formData.get('name') as string
    const location = formData.get('location') as string
    const status = formData.get('status') as 'visited' | 'wishlist'
    const visited_date = formData.get('visited_date') as string || null
    const price = formData.get('price') ? parseInt(formData.get('price') as string) : null
    const rating = formData.get('rating') ? parseInt(formData.get('rating') as string) : null
    const review = formData.get('review') as string
    const surrounding_facilities = formData.get('surrounding_facilities') as string

    // Existing images
    let image_urls = formData.getAll('existing_images') as string[]

    // New images
    const files = formData.getAll('images') as File[]
    if (files && files.length > 0) {
        for (const file of files) {
            if (file.size === 0) continue;

            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('campsite_images')
                .upload(fileName, file)

            if (uploadError) {
                console.error('Error uploading image:', uploadError)
                continue
            }

            const { data: { publicUrl } } = supabase.storage
                .from('campsite_images')
                .getPublicUrl(fileName)

            image_urls.push(publicUrl)
        }
    }

    const { error } = await supabase.from('campsites').update({
        name,
        location,
        status,
        visited_date,
        price,
        rating,
        review,
        surrounding_facilities,
        image_urls
    }).eq('id', id).eq('user_id', user.id)

    if (error) {
        console.error('Error updating campsite', error)
        throw new Error('Failed to update campsite')
    }

    revalidatePath('/')
    revalidatePath(`/campsites/${id}`)
    redirect(`/campsites/${id}`)
}
