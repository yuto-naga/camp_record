import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  
  // Verify that the request is sent by Vercel Cron using the CRON_TOKEN secret
  if (authHeader !== `Bearer ${process.env.CRON_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('campsites')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Database query error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: data?.length || 0 })
  } catch (err: any) {
    console.error('Unhandled cron error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
