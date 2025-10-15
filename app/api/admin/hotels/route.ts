import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHotelSchema } from '@/lib/validations'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// GET - List all hotels with optional filtering and search
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

  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const atoll = searchParams.get('atoll') || ''
    const type = searchParams.get('type') || ''
    const status = searchParams.get('status') || ''

    // Build query
    let query = supabase
      .from('hotels')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true })

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }
    if (atoll) {
      query = query.eq('atoll', atoll)
    }
    if (type) {
      query = query.eq('type', type)
    }
    if (status) {
      query = query.eq('status', status)
    }

    const { data: hotels, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      hotels: hotels || [],
      count: count || 0,
    })
  } catch (error: any) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hotels' },
      { status: 500 }
    )
  }
}

// POST - Create new hotel
export async function POST(request: NextRequest) {
  // Apply rate limiting - 60 requests per minute for admins
  const rateLimitResult = await rateLimit(request, RATE_LIMITS.ADMIN)
  if (rateLimitResult) {
    return rateLimitResult
  }

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

  try {
    const body = await request.json()

    // Validate input
    const validatedData = createHotelSchema.parse(body)

    // Check if hotel name already exists
    const { data: existingHotel } = await supabase
      .from('hotels')
      .select('id, name')
      .ilike('name', validatedData.name)
      .single()

    if (existingHotel) {
      return NextResponse.json(
        { error: 'A hotel with this name already exists' },
        { status: 400 }
      )
    }

    // Create hotel
    const { data: hotel, error } = await supabase
      .from('hotels')
      .insert({
        name: validatedData.name,
        atoll: validatedData.atoll,
        type: validatedData.type,
        staff_count: validatedData.staff_count,
        status: validatedData.status || 'active',
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      hotel,
      message: 'Hotel created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating hotel:', error)

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create hotel' },
      { status: 500 }
    )
  }
}
