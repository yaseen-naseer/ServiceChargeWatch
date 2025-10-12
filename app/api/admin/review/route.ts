import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendSubmissionApprovedEmail, sendSubmissionRejectedEmail } from '@/lib/email/send'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const { submissionId, action, rejectionReason } = await request.json()

    if (!submissionId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Fetch the submission with hotel details
    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select(`
        *,
        hotels (name)
      `)
      .eq('id', submissionId)
      .single()

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    if (action === 'approve') {
      // Create or update sc_record
      const { data: existingRecord } = await supabase
        .from('sc_records')
        .select('*')
        .eq('hotel_id', submission.hotel_id)
        .eq('month', submission.month)
        .eq('year', submission.year)
        .single()

      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('sc_records')
          .update({
            verification_count: existingRecord.verification_count + 1,
            verified_at: new Date().toISOString(),
            verified_by: user.id,
          })
          .eq('id', existingRecord.id)

        if (updateError) {
          console.error('Update error:', updateError)
          return NextResponse.json(
            { error: 'Failed to update record' },
            { status: 500 }
          )
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('sc_records')
          .insert({
            hotel_id: submission.hotel_id,
            month: submission.month,
            year: submission.year,
            usd_amount: submission.usd_amount,
            mvr_amount: submission.mvr_amount,
            verification_status: 'verified',
            verified_at: new Date().toISOString(),
            verified_by: user.id,
          })

        if (insertError) {
          console.error('Insert error:', insertError)
          return NextResponse.json(
            { error: 'Failed to create record' },
            { status: 500 }
          )
        }
      }

      // Update submission status
      const { error: updateSubmissionError } = await supabase
        .from('submissions')
        .update({
          status: 'approved',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submissionId)

      if (updateSubmissionError) {
        return NextResponse.json(
          { error: 'Failed to update submission' },
          { status: 500 }
        )
      }

      // Send approval email
      const totalUsd = submission.usd_amount + (submission.mvr_amount || 0) / 15.42
      await sendSubmissionApprovedEmail({
        to: submission.submitter_email,
        hotelName: (submission.hotels as any).name,
        month: submission.month,
        year: submission.year,
        usdAmount: submission.usd_amount,
        mvrAmount: submission.mvr_amount || undefined,
        totalUsd,
      })
    } else if (action === 'reject') {
      if (!rejectionReason) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        )
      }

      // Update submission status
      const { error: updateError } = await supabase
        .from('submissions')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submissionId)

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to reject submission' },
          { status: 500 }
        )
      }

      // Send rejection email
      await sendSubmissionRejectedEmail({
        to: submission.submitter_email,
        hotelName: (submission.hotels as any).name,
        month: submission.month,
        year: submission.year,
        rejectionReason,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Review error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
