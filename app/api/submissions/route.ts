import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Parse form data
    const formData = await request.formData()
    const hotelId = formData.get('hotelId') as string
    const month = parseInt(formData.get('month') as string)
    const year = parseInt(formData.get('year') as string)
    const usdAmount = parseFloat(formData.get('usdAmount') as string)
    const mvrAmount = formData.get('mvrAmount')
      ? parseFloat(formData.get('mvrAmount') as string)
      : null
    const position = formData.get('position') as string
    const proofFile = formData.get('proofFile') as File | null

    // Validate required fields
    if (!hotelId || !month || !year || !usdAmount || !position) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let proofUrl: string | null = null

    // Upload proof file to Supabase Storage if provided
    if (proofFile && proofFile.size > 0) {
      const fileExt = proofFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('payslip-proofs')
        .upload(fileName, proofFile)

      if (uploadError) {
        console.error('File upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload proof file' },
          { status: 500 }
        )
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payslip-proofs')
        .getPublicUrl(fileName)

      proofUrl = publicUrl
    }

    // Insert submission into database
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        hotel_id: hotelId,
        month,
        year,
        usd_amount: usdAmount,
        mvr_amount: mvrAmount,
        submitter_email: user.email || '',
        submitter_user_id: user.id,
        position,
        proof_url: proofUrl,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create submission' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
