import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!adminUser) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')

  try {
    // Build query
    let query = supabase
      .from('submissions')
      .select(`
        *,
        hotels (*)
      `)
      .order('created_at', { ascending: false })

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status)
    }

    const { data: submissions, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json(submissions || [])
  } catch (error: any) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to export submissions' },
      { status: 500 }
    )
  }
}
