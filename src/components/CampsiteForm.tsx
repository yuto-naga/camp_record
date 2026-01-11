'use client'

import { createCampsite, updateCampsite } from '@/app/campsites/actions'
import { useState } from 'react'
import { Campsite } from '@/types/supabase'
import imageCompression from 'browser-image-compression';

export default function CampsiteForm({ campsite }: { campsite?: Campsite }) {
    const [status, setStatus] = useState<string>(campsite?.status || 'visited');
    const [rating, setRating] = useState<number>(campsite?.rating || 0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const formData = new FormData(event.currentTarget);
            const action = campsite ? updateCampsite : createCampsite;

            const imageFiles = formData.getAll('images') as File[];
            // Remove uncompressed images
            formData.delete('images');

            if (imageFiles && imageFiles.length > 0) {
                const options = {
                    maxSizeMB: 0.5, // 0.5MB limit
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                };

                for (const file of imageFiles) {
                    if (file.size === 0) continue;
                    try {
                        console.log(`Compressing ${file.name}... Original size: ${file.size / 1024 / 1024} MB`);
                        const compressedFile = await imageCompression(file, options);
                        console.log(`Compressed size: ${compressedFile.size / 1024 / 1024} MB`);
                        formData.append('images', compressedFile);
                    } catch (error) {
                        console.error('Compression failed:', error);
                        // Fallback to original
                        formData.append('images', file);
                    }
                }
            }

            await action(formData);
        } catch (error: any) {
            // Ignore redirect "errors"
            if (error?.digest?.includes('NEXT_REDIRECT')) {
                return;
            }

            console.error('Submission error:', error);
            alert('エラーが発生しました。もう一度お試しください。');
            setIsSubmitting(false);
        }
        // Note: We don't set isSubmitting(false) on success because we redirect
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
            {campsite && <input type="hidden" name="id" value={campsite.id} />}
            {/* Preserve existing images if updating, simplified approach */}
            {campsite?.image_urls?.map(url => (
                <input key={url} type="hidden" name="existing_images" value={url} />
            ))}

            <div className="space-y-8 divide-y divide-gray-200">
                <div>
                    <div>
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                            {campsite ? 'キャンプ場情報の編集' : 'キャンプ場情報の登録'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            キャンプの思い出や、行きたい場所の詳細を記録しましょう。
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                キャンプ場名 <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    defaultValue={campsite?.name}
                                    placeholder="例: ふもとっぱらキャンプ場"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                                ステータス
                            </label>
                            <div className="mt-2">
                                <select
                                    id="status"
                                    name="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                >
                                    <option value="visited">行った</option>
                                    <option value="wishlist">行きたい</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                                場所・住所
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="location"
                                    id="location"
                                    defaultValue={campsite?.location || ''}
                                    placeholder="例: 静岡県富士宮市..."
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                />
                            </div>
                        </div>

                        {status === 'visited' && (
                            <>
                                <div className="sm:col-span-3">
                                    <label htmlFor="visited_date" className="block text-sm font-medium leading-6 text-gray-900">
                                        訪問日
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="date"
                                            name="visited_date"
                                            id="visited_date"
                                            defaultValue={campsite?.visited_date || ''}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                                        費用 (円)
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            name="price"
                                            id="price"
                                            defaultValue={campsite?.price || ''}
                                            placeholder="例: 5000"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="rating" className="block text-sm font-medium leading-6 text-gray-900">
                                        評価
                                    </label>
                                    <div className="mt-2 flex items-center gap-1">
                                        <input type="hidden" name="rating" value={rating} />
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-sm"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill={(hoverRating || rating) >= star ? "#FBBF24" : "#D1D5DB"}
                                                    className="w-8 h-8 transition-colors duration-150"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {rating > 0 ? `${rating} / 5` : 'クリックして評価'}
                                    </p>
                                </div>
                            </>
                        )}

                        <div className="col-span-full">
                            <label htmlFor="review" className="block text-sm font-medium leading-6 text-gray-900">
                                感想・メモ
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="review"
                                    name="review"
                                    rows={5}
                                    defaultValue={campsite?.review || ''}
                                    placeholder="景色が最高でした！また行きたいです。"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="surrounding_facilities" className="block text-sm font-medium leading-6 text-gray-900">
                                周辺施設
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="surrounding_facilities"
                                    name="surrounding_facilities"
                                    rows={5}
                                    defaultValue={campsite?.surrounding_facilities || ''}
                                    placeholder="近くに温泉やスーパーがあります。"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="images" className="block text-sm font-medium leading-6 text-gray-900">
                                写真
                            </label>
                            <div className="mt-2">
                                <input
                                    type="file"
                                    name="images"
                                    id="images"
                                    multiple
                                    accept="image/*"
                                    className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-indigo-50 file:text-indigo-700
                                    hover:file:bg-indigo-100"
                                />
                                {campsite?.image_urls && campsite.image_urls.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500 mb-2">登録済みの写真:</p>
                                        <div className="flex gap-2 overflow-x-auto">
                                            {campsite.image_urls.map((url, i) => (
                                                <div key={i} className="relative w-20 h-20 flex-shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={url} alt={`Photo ${i}`} className="h-full w-full object-cover rounded" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-5">
                <div className="flex justify-end gap-x-3">
                    <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => window.history.back()}
                        disabled={isSubmitting}
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '保存中...' : '保存'}
                    </button>
                </div>
            </div>
        </form>
    )
}
