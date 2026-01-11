'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Campsite } from '@/types/supabase'
import { formatDate } from '@/lib/utils'
import StarRating from './StarRating'

export default function DashboardClient({
    visitedCampsites,
    wishlistCampsites
}: {
    visitedCampsites: Campsite[] | null,
    wishlistCampsites: Campsite[] | null
}) {
    const [searchText, setSearchText] = useState('')

    const filterCampsites = (campsites: Campsite[] | null) => {
        if (!campsites) return []
        if (!searchText) return campsites

        const lowerText = searchText.toLowerCase()
        return campsites.filter(site =>
            (site.name && site.name.toLowerCase().includes(lowerText)) ||
            (site.location && site.location.toLowerCase().includes(lowerText)) ||
            (site.review && site.review.toLowerCase().includes(lowerText)) ||
            (site.surrounding_facilities && site.surrounding_facilities.toLowerCase().includes(lowerText))
        )
    }

    const filteredVisited = filterCampsites(visitedCampsites)
    const filteredWishlist = filterCampsites(wishlistCampsites)

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="キーワードで検索 (場所、名前など)..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3 pr-10"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                    </div>
                    <Link
                        href="/campsites/new"
                        className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap"
                    >
                        記録を追加
                    </Link>
                </div>
            </div>

            {/* Visited Campsites Section */}
            <section>
                <h2 className="mb-4 text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                    行ったリスト
                    <span className="text-sm font-normal text-gray-500">({filteredVisited.length})</span>
                </h2>
                {filteredVisited.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredVisited.map((site: Campsite) => (
                            <CampsiteCard key={site.id} site={site} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">
                        {searchText ? '条件に一致する記録が見つかりませんでした。' : 'まだ行ったキャンプ場の記録がありません。'}
                    </p>
                )}
            </section>

            {/* Wishlist Section */}
            <section>
                <h2 className="mb-4 text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                    行きたいリスト
                    <span className="text-sm font-normal text-gray-500">({filteredWishlist.length})</span>
                </h2>
                {filteredWishlist.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredWishlist.map((site: Campsite) => (
                            <CampsiteCard key={site.id} site={site} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">
                        {searchText ? '条件に一致する記録が見つかりませんでした。' : '行きたいリストは空です。'}
                    </p>
                )}
            </section>
        </div>
    )
}

function CampsiteCard({ site }: { site: Campsite }) {
    return (
        <Link href={`/campsites/${site.id}`} className="group block overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow">
            <div className="h-48 w-full bg-gray-200 object-cover relative">
                {site.image_urls && site.image_urls.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={site.image_urls[0]}
                        alt={site.name}
                        className="h-full w-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        <span className="text-4xl">⛺</span>
                    </div>
                )}
                {site.rating ? (
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                        <StarRating rating={site.rating} />
                    </div>
                ) : null}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                    {site.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    {site.location || '場所未設定'}
                </p>
                {site.visited_date && (
                    <p className="mt-2 text-xs text-gray-400">
                        訪問日: {new Date(site.visited_date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')}
                    </p>
                )}
                {site.status === 'wishlist' && (
                    <span className="mt-2 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                        行きたい
                    </span>
                )}
            </div>
        </Link>
    )
}
