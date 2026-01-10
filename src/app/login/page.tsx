'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            console.error('Google login error:', error)
            alert('ログインに失敗しました。')
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md text-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">CampRecord</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        キャンプの思い出を記録しよう
                    </p>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            '処理中...'
                        ) : (
                            <>
                                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                    <path
                                        d="M12.0003 20.45C16.6663 20.45 20.5823 17.279 22.0063 13.085H12.0003V10.915H22.0063C22.0063 10.915 22.0063 10.915 22.0063 10.915C22.2533 11.758 22.3853 12.646 22.3853 13.55C22.3853 19.324 17.7363 24 12.0003 24C5.37233 24 0.000328064 18.627 0.000328064 12C0.000328064 5.372 5.37233 0 12.0003 0C14.9983 0 17.7473 1.109 19.8973 2.934L18.0673 4.764C16.5183 3.376 14.3973 2.59 12.0003 2.59C6.98033 2.59 2.76633 6.275 1.83933 11.026L3.98533 12.69C4.84533 9.426 7.76533 7.09 11.0003 7.09L12.0003 7.09V20.45Z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M11.0003 7.09L3.98533 12.69C2.93633 10.057 2.93633 7.033 3.98533 4.4L1.83933 11.026C5.37233 1.026 0.000328064 6.398 0.000328064 12L3.98533 12.69L11.0003 7.09Z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M18.0673 4.764L19.8973 2.934C21.4643 1.503 23.5853 0.69 26.0823 0.69C29.6233 0.69 32.5403 2.784 33.7433 5.861L31.5973 7.525C30.7373 5.093 28.5303 3.28 26.0823 3.28V4.764H18.0673Z"
                                        fill="#EA4335"
                                    />
                                    <path
                                        d="M22.0063 13.085L22.0063 10.915H12.0003V13.085H22.0063Z"
                                        fill="#34A853"
                                    />
                                </svg>
                                <span className="text-sm font-semibold leading-6">Googleでログイン</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
