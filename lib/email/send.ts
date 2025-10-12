import resend from './resend'
import { getSubmissionApprovedEmail, getSubmissionRejectedEmail } from './templates'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

interface SendSubmissionApprovedEmailParams {
  to: string
  hotelName: string
  month: number
  year: number
  usdAmount: number
  mvrAmount?: number
  totalUsd: number
}

export async function sendSubmissionApprovedEmail({
  to,
  hotelName,
  month,
  year,
  usdAmount,
  mvrAmount,
  totalUsd,
}: SendSubmissionApprovedEmailParams) {
  try {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email not sent.')
      return { success: false, message: 'Email service not configured' }
    }

    const { subject, html, text } = getSubmissionApprovedEmail({
      hotelName,
      month,
      year,
      usdAmount,
      mvrAmount,
      totalUsd,
    })

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Error sending approval email:', error)
      return { success: false, message: error.message }
    }

    console.log('Approval email sent successfully:', data)
    return { success: true, data }
  } catch (error: any) {
    console.error('Error sending approval email:', error)
    return { success: false, message: error.message || 'Failed to send email' }
  }
}

interface SendSubmissionRejectedEmailParams {
  to: string
  hotelName: string
  month: number
  year: number
  rejectionReason: string
}

export async function sendSubmissionRejectedEmail({
  to,
  hotelName,
  month,
  year,
  rejectionReason,
}: SendSubmissionRejectedEmailParams) {
  try {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email not sent.')
      return { success: false, message: 'Email service not configured' }
    }

    const { subject, html, text } = getSubmissionRejectedEmail({
      hotelName,
      month,
      year,
      rejectionReason,
    })

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Error sending rejection email:', error)
      return { success: false, message: error.message }
    }

    console.log('Rejection email sent successfully:', data)
    return { success: true, data }
  } catch (error: any) {
    console.error('Error sending rejection email:', error)
    return { success: false, message: error.message || 'Failed to send email' }
  }
}
