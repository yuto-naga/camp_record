import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Campsite } from '@/types/supabase'

export default async function CampsiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

    const campsite = site as Campsite

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{campsite.name}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{campsite.location}</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/campsites/${campsite.id}/edit`}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        編集
                    </Link>
                    <form action={async () => {
                        'use server'
                        const supabase = await createClient()
                        await supabase.from('campsites').delete().eq('id', id)
                        redirect('/')
                    }}>
                        <button
                            type="submit"
                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                        >
                            削除
                        </button>
                    </form>
                </div>
            </div>
            <div className="border-t border-gray-200">
                <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">ステータス</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                            {campsite.status === 'visited' ? '行った' : '行きたい'}
                        </dd>
                    </div>

                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">場所・住所</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {campsite.location ? (
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campsite.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-500 hover:underline flex items-center gap-1"
                                >
                                    {campsite.location}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M10 2c-1.716 0-3.433.955-4.25 2.55-1.026 2.006.185 4.385 1.55 5.8 1.488 1.54 3.05 2.7 4.25 4.542 1.2-1.842 2.762-3.002 4.25-4.542 1.365-1.415 2.576-3.794 1.55-5.8C16.433 2.955 14.716 2 10 2zm0 14c-1.25 0-3.75-2.5-3.75-5.5S8.75 5 10 5s3.75 2.5 3.75 5.5S11.25 16 10 16z" clipRule="evenodd" />
                                        <path d="M10 8a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                </a>
                            ) : (
                                '-'
                            )}
                        </dd>
                    </div>

                    {campsite.visited_date && (
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">訪問日</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(campsite.visited_date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}</dd>
                        </div>
                    )}
                    {campsite.price && (
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">費用</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">¥{campsite.price.toLocaleString()}</dd>
                        </div>
                    )}
                    {!!campsite.rating && (
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">評価</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                                <span className="text-yellow-400 text-lg mr-1">
                                    {'★'.repeat(campsite.rating)}
                                    <span className="text-gray-300">{'★'.repeat(5 - campsite.rating)}</span>
                                </span>
                                <span className="text-gray-500 text-sm ml-2">({campsite.rating} / 5)</span>
                            </dd>
                        </div>
                    )}
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">感想・メモ</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{campsite.review || '-'}</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">周辺施設</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{campsite.surrounding_facilities || '-'}</dd>
                    </div>
                </dl>

                <div className="bg-white px-4 py-5 sm:px-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">写真</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {campsite.image_urls && campsite.image_urls.map((url, index) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="block">
                                <img
                                    src={url}
                                    alt={`Campsite photo ${index + 1}`}
                                    className="w-full h-auto rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                />
                            </a>
                        ))}
                    </div>
                    {(!campsite.image_urls || campsite.image_urls.length === 0) && (
                        <p className="text-gray-400 italic">写真はありません</p>
                    )}
                </div>
            </div>
        </div>
    )
}
