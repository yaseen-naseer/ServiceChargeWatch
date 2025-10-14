import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendSubmissionApprovedEmail, sendSubmissionRejectedEmail } from '@/lib/email/send'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

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
    const { submissionIds, action, rejectionReason } = await request.json()

    if (!submissionIds || !Array.isArray(submissionIds) || submissionIds.length === 0) {
      return NextResponse.json({ error: 'Invalid submission IDs' }, { status: 400 })
    }

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (action === 'reject' && !rejectionReason) {
      return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 })
    }

    let processedCount = 0

    for (const submissionId of submissionIds) {
      // Fetch submission with hotel details
      const { data: submission } = await supabase
        .from('submissions')
        .select(`
          *,
          hotels (name)
        `)
        .eq('id', submissionId)
        .single()

      if (!submission) continue

      if (action === 'approve') {
        // Calculate total USD (USD + MVR converted to USD at ~15.42 rate)
        const totalUSD = submission.usd_amount + (submission.mvr_amount || 0) / 15.42

        // Create or update SC record
        const { error: scError } = await supabase
          .from('sc_records')
          .upsert({
            hotel_id: submission.hotel_id,
            month: submission.month,
            year: submission.year,
            usd_amount: submission.usd_amount,
            mvr_amount: submission.mvr_amount,
            total_usd: totalUSD,
            verification_status: 'verified',
            verification_count: 1,
            verified_at: new Date().toISOString(),
            verified_by: user.id,
          }, {
            onConflict: 'hotel_id,month,year',
          })

        if (scError) {
          console.error('Error creating SC record:', scError)
          continue
        }

        // Update submission status
        await supabase
          .from('submissions')
          .update({
            status: 'approved',
            reviewed_at: new Date().toISOString(),
            reviewed_by: user.id,
          })
          .eq('id', submissionId)

        // Send approval email
        await sendSubmissionApprovedEmail({
          to: submission.submitter_email,
          hotelName: (submission.hotels as any).name,
          month: submission.month,
          year: submission.year,
          usdAmount: submission.usd_amount,
          mvrAmount: submission.mvr_amount || undefined,
          totalUsd: totalUSD,
        })
      } else if (action === 'reject') {
        // Update submission status
        await supabase
          .from('submissions')
          .update({
            status: 'rejected',
            reviewed_at: new Date().toISOString(),
            reviewed_by: user.id,
            rejection_reason: rejectionReason,
          })
          .eq('id', submissionId)

        // Send rejection email
        await sendSubmissionRejectedEmail({
          to: submission.submitter_email,
          hotelName: (submission.hotels as any).name,
          month: submission.month,
          year: submission.year,
          rejectionReason,
        })
      }

      processedCount++
    }

    return NextResponse.json({
      success: true,
      count: processedCount,
      action,
    })
  } catch (error: any) {
    console.error('Bulk review error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process bulk review' },
      { status: 500 }
    )
  }
}
