import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// PATCH - Update a pending submission
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Verify the submission belongs to the user and is pending
    const { data: existingSubmission, error: fetchError } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .eq('submitter_user_id', user.id)
      .eq('status', 'pending')
      .single()

    if (fetchError || !existingSubmission) {
      return NextResponse.json(
        { error: 'Submission not found or cannot be edited' },
        { status: 404 }
      )
    }

    // Update the submission
    const { data: updatedSubmission, error: updateError } = await supabase
      .from('submissions')
      .update({
        hotel_id: body.hotel_id,
        month: body.month,
        year: body.year,
        usd_amount: body.usd_amount,
        mvr_amount: body.mvr_amount || null,
        position: body.position,
        proof_url: body.proof_url || null,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update submission' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: updatedSubmission })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a pending submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify the submission belongs to the user and is pending
    const { data: existingSubmission, error: fetchError } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .eq('submitter_user_id', user.id)
      .eq('status', 'pending')
      .single()

    if (fetchError || !existingSubmission) {
      return NextResponse.json(
        { error: 'Submission not found or cannot be deleted' },
        { status: 404 }
      )
    }

    // Delete the submission
    const { error: deleteError } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete submission' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
