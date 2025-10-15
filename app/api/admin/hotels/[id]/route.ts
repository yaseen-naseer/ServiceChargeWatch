import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateHotelSchema } from '@/lib/validations'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// PUT - Update hotel
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params
    const body = await request.json()

    // Validate input
    const validatedData = updateHotelSchema.parse(body)

    // Check if hotel exists
    const { data: existingHotel } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingHotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    // If name is being changed, check for duplicates
    if (validatedData.name && validatedData.name !== existingHotel.name) {
      const { data: duplicateHotel } = await supabase
        .from('hotels')
        .select('id, name')
        .ilike('name', validatedData.name)
        .neq('id', id)
        .single()

      if (duplicateHotel) {
        return NextResponse.json(
          { error: 'A hotel with this name already exists' },
          { status: 400 }
        )
      }
    }

    // Update hotel
    const { data: hotel, error } = await supabase
      .from('hotels')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      hotel,
      message: 'Hotel updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating hotel:', error)

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update hotel' },
      { status: 500 }
    )
  }
}

// DELETE - Deactivate hotel (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params

    // Check if hotel exists
    const { data: existingHotel } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingHotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    // Check if hotel has any submissions or SC records
    const { count: submissionsCount } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('hotel_id', id)

    const { count: scRecordsCount } = await supabase
      .from('sc_records')
      .select('*', { count: 'exact', head: true })
      .eq('hotel_id', id)

    if ((submissionsCount && submissionsCount > 0) || (scRecordsCount && scRecordsCount > 0)) {
      // Soft delete: Mark as closed instead of deleting
      const { data: hotel, error } = await supabase
        .from('hotels')
        .update({
          status: 'closed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return NextResponse.json({
        success: true,
        hotel,
        message: 'Hotel marked as closed (has existing data)',
      })
    } else {
      // Hard delete: No related data
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return NextResponse.json({
        success: true,
        message: 'Hotel deleted successfully',
      })
    }
  } catch (error: any) {
    console.error('Error deleting hotel:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete hotel' },
      { status: 500 }
    )
  }
}
