import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// GET - List all admin users
export async function GET() {
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
    // Fetch all admin users with their auth details
    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(adminUsers || [])
  } catch (error: any) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch admin users' },
      { status: 500 }
    )
  }
}

// POST - Add new admin user
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
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Check if user exists in auth.users
    const { data: existingUser, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
      console.error('Error checking user:', userError)
      return NextResponse.json(
        { error: 'Failed to verify user existence' },
        { status: 500 }
      )
    }

    const targetUser = existingUser.users.find(u => u.email === email)

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found. They must sign up first before being granted admin access.' },
        { status: 404 }
      )
    }

    // Check if already an admin
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', targetUser.id)
      .single()

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'User is already an admin' },
        { status: 400 }
      )
    }

    // Add admin role
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert({
        user_id: targetUser.id,
        email: email,
        role: 'admin',
      })

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({ success: true, message: 'Admin user added successfully' })
  } catch (error: any) {
    console.error('Error adding admin user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add admin user' },
      { status: 500 }
    )
  }
}

// DELETE - Remove admin user
export async function DELETE(request: NextRequest) {
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
    const { adminId } = await request.json()

    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 })
    }

    // Prevent removing yourself
    if (adminId === adminUser.id) {
      return NextResponse.json(
        { error: 'You cannot remove yourself as an admin' },
        { status: 400 }
      )
    }

    // Check if there's more than one admin
    const { count } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true })

    if (count && count <= 1) {
      return NextResponse.json(
        { error: 'Cannot remove the last admin user' },
        { status: 400 }
      )
    }

    // Remove admin role
    const { error: deleteError } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminId)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ success: true, message: 'Admin user removed successfully' })
  } catch (error: any) {
    console.error('Error removing admin user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to remove admin user' },
      { status: 500 }
    )
  }
}
