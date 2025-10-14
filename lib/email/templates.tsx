import { MONTHS } from '@/lib/constants'

interface SubmissionApprovedEmailProps {
  hotelName: string
  month: number
  year: number
  usdAmount: number
  mvrAmount?: number
  totalUsd: number
}

export function getSubmissionApprovedEmail({
  hotelName,
  month,
  year,
  usdAmount,
  mvrAmount,
  totalUsd,
}: SubmissionApprovedEmailProps) {
  const monthName = MONTHS[month - 1]

  return {
    subject: `✅ Your submission for ${hotelName} has been approved`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Submission Approved</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <div style="display: inline-block; background: white; width: 60px; height: 60px; border-radius: 12px; line-height: 60px; font-size: 28px; font-weight: bold; color: #3b82f6; margin-bottom: 10px;">
              SC
            </div>
            <h1 style="color: white; margin: 10px 0; font-size: 28px;">Submission Approved!</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px;">
              <p style="font-size: 16px; margin-top: 0;">Great news! Your service charge submission has been verified and approved.</p>

              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1e40af;">Submission Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Hotel:</td>
                    <td style="padding: 8px 0; text-align: right;">${hotelName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Period:</td>
                    <td style="padding: 8px 0; text-align: right;">${monthName} ${year}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b;">USD Amount:</td>
                    <td style="padding: 8px 0; text-align: right; font-family: 'Courier New', monospace;">$${usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  ${mvrAmount ? `
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b;">MVR Amount:</td>
                    <td style="padding: 8px 0; text-align: right; font-family: 'Courier New', monospace;">MVR ${mvrAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  ` : ''}
                  <tr style="border-top: 2px solid #e2e8f0;">
                    <td style="padding: 12px 0 0 0; font-weight: 700; color: #1e40af; font-size: 16px;">Total (USD):</td>
                    <td style="padding: 12px 0 0 0; text-align: right; font-family: 'Courier New', monospace; font-weight: 700; font-size: 16px; color: #1e40af;">$${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </table>
              </div>

              <p style="margin-bottom: 25px;">This data is now visible on the public leaderboard and will help promote transparency in the Maldivian hospitality industry.</p>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}"
                   style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  View on Leaderboard
                </a>
              </div>
            </div>

            <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 20px;">
              <p style="margin: 5px 0;">Thank you for contributing to Service Charge Watch</p>
              <p style="margin: 5px 0;">Together we're building a more transparent industry</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Submission Approved!

Great news! Your service charge submission has been verified and approved.

Submission Details:
- Hotel: ${hotelName}
- Period: ${monthName} ${year}
- USD Amount: $${usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
${mvrAmount ? `- MVR Amount: MVR ${mvrAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : ''}
- Total (USD): $${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}

This data is now visible on the public leaderboard and will help promote transparency in the Maldivian hospitality industry.

View on Leaderboard: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}

Thank you for contributing to Service Charge Watch.
Together we're building a more transparent industry.
    `.trim(),
  }
}

interface SubmissionRejectedEmailProps {
  hotelName: string
  month: number
  year: number
  rejectionReason: string
}

export function getSubmissionRejectedEmail({
  hotelName,
  month,
  year,
  rejectionReason,
}: SubmissionRejectedEmailProps) {
  const monthName = MONTHS[month - 1]

  return {
    subject: `❌ Your submission for ${hotelName} requires attention`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Submission Rejected</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <div style="display: inline-block; background: white; width: 60px; height: 60px; border-radius: 12px; line-height: 60px; font-size: 28px; font-weight: bold; color: #ef4444; margin-bottom: 10px;">
              SC
            </div>
            <h1 style="color: white; margin: 10px 0; font-size: 28px;">Submission Requires Attention</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px;">
              <p style="font-size: 16px; margin-top: 0;">Your service charge submission could not be approved at this time.</p>

              <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
                <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #b91c1c;">Submission Details</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Hotel:</td>
                    <td style="padding: 8px 0; text-align: right;">${hotelName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Period:</td>
                    <td style="padding: 8px 0; text-align: right;">${monthName} ${year}</td>
                  </tr>
                </table>

                <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
                  <p style="margin: 0 0 8px 0; font-weight: 600; color: #b91c1c; font-size: 14px;">Reason for Rejection:</p>
                  <p style="margin: 0; color: #374151;">${rejectionReason}</p>
                </div>
              </div>

              <p style="margin-bottom: 25px;">Please review the feedback above and feel free to submit again with the necessary corrections or additional documentation.</p>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/submit"
                   style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Submit Again
                </a>
              </div>
            </div>

            <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 20px;">
              <p style="margin: 5px 0;">Thank you for your contribution to Service Charge Watch</p>
              <p style="margin: 5px 0;">If you have questions, please reach out to our support team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Submission Requires Attention

Your service charge submission could not be approved at this time.

Submission Details:
- Hotel: ${hotelName}
- Period: ${monthName} ${year}

Reason for Rejection:
${rejectionReason}

Please review the feedback above and feel free to submit again with the necessary corrections or additional documentation.

Submit Again: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/submit

Thank you for your contribution to Service Charge Watch.
If you have questions, please reach out to our support team.
    `.trim(),
  }
}

interface PasswordResetEmailProps {
  resetLink: string
  userEmail: string
}

export function getPasswordResetEmail({
  resetLink,
  userEmail,
}: PasswordResetEmailProps) {
  return {
    subject: '🔐 Reset your Service Charge Watch password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <div style="display: inline-block; background: white; width: 60px; height: 60px; border-radius: 12px; line-height: 60px; font-size: 28px; font-weight: bold; color: #3b82f6; margin-bottom: 10px;">
              SC
            </div>
            <h1 style="color: white; margin: 10px 0; font-size: 28px;">Reset Your Password</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px;">
              <p style="font-size: 16px; margin-top: 0;">Hi there,</p>

              <p style="font-size: 16px;">We received a request to reset the password for your Service Charge Watch account associated with <strong>${userEmail}</strong>.</p>

              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-weight: 600; color: #1e40af;">Click the button below to reset your password:</p>
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${resetLink}"
                     style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Reset Password
                  </a>
                </div>
              </div>

              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour and can only be used once.
                </p>
              </div>

              <p style="font-size: 14px; color: #64748b; margin-bottom: 15px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="font-size: 12px; background: #f1f5f9; padding: 12px; border-radius: 6px; word-break: break-all; font-family: 'Courier New', monospace; color: #475569;">
                ${resetLink}
              </p>

              <div style="border-top: 2px solid #e2e8f0; margin: 25px 0; padding-top: 20px;">
                <p style="font-size: 14px; color: #64748b; margin: 0;">
                  <strong>Didn't request this?</strong> You can safely ignore this email. Your password won't be changed unless you click the link above.
                </p>
              </div>
            </div>

            <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 20px;">
              <p style="margin: 5px 0;">Service Charge Watch</p>
              <p style="margin: 5px 0;">Empowering hospitality workers through transparency</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Reset Your Password

Hi there,

We received a request to reset the password for your Service Charge Watch account associated with ${userEmail}.

Click this link to reset your password:
${resetLink}

⚠️ SECURITY NOTICE: This link will expire in 1 hour and can only be used once.

Didn't request this? You can safely ignore this email. Your password won't be changed unless you click the link above.

---
Service Charge Watch
Empowering hospitality workers through transparency
    `.trim(),
  }
}

interface WelcomeEmailProps {
  confirmLink?: string
}

export function getWelcomeEmail({
  confirmLink,
}: WelcomeEmailProps) {
  return {
    subject: '👋 Welcome to Service Charge Watch!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Service Charge Watch</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <div style="display: inline-block; background: white; width: 60px; height: 60px; border-radius: 12px; line-height: 60px; font-size: 28px; font-weight: bold; color: #3b82f6; margin-bottom: 10px;">
              SC
            </div>
            <h1 style="color: white; margin: 10px 0; font-size: 28px;">Welcome to Service Charge Watch!</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px;">
              <p style="font-size: 16px; margin-top: 0;">Hi there! 👋</p>

              <p style="font-size: 16px;">Thank you for joining Service Charge Watch! We're building a transparent platform for hospitality workers in the Maldives to share and compare service charge information.</p>

              ${confirmLink ? `
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-weight: 600; color: #1e40af;">Please confirm your email address to get started:</p>
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${confirmLink}"
                     style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Confirm Email Address
                  </a>
                </div>
              </div>
              ` : ''}

              <h2 style="font-size: 20px; color: #1e40af; margin-top: 30px;">What You Can Do:</h2>

              <div style="margin: 20px 0;">
                <div style="display: flex; margin-bottom: 15px;">
                  <div style="flex-shrink: 0; width: 40px; height: 40px; background: #dbeafe; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                    📊
                  </div>
                  <div>
                    <h3 style="margin: 0 0 5px 0; font-size: 16px;">View Service Charge Rankings</h3>
                    <p style="margin: 0; font-size: 14px; color: #64748b;">Compare service charges across hotels and atolls</p>
                  </div>
                </div>

                <div style="display: flex; margin-bottom: 15px;">
                  <div style="flex-shrink: 0; width: 40px; height: 40px; background: #dbeafe; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                    📝
                  </div>
                  <div>
                    <h3 style="margin: 0 0 5px 0; font-size: 16px;">Submit Your Data</h3>
                    <p style="margin: 0; font-size: 14px; color: #64748b;">Share your service charge information anonymously</p>
                  </div>
                </div>

                <div style="display: flex; margin-bottom: 15px;">
                  <div style="flex-shrink: 0; width: 40px; height: 40px; background: #dbeafe; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                    🔒
                  </div>
                  <div>
                    <h3 style="margin: 0 0 5px 0; font-size: 16px;">Privacy Protected</h3>
                    <p style="margin: 0; font-size: 14px; color: #64748b;">Your email is never shared publicly</p>
                  </div>
                </div>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}"
                   style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Visit Leaderboard
                </a>
              </div>
            </div>

            <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 20px;">
              <p style="margin: 5px 0;">Together we're building a more transparent industry</p>
              <p style="margin: 5px 0;">Questions? Reach out to our support team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to Service Charge Watch!

Hi there! 👋

Thank you for joining Service Charge Watch! We're building a transparent platform for hospitality workers in the Maldives to share and compare service charge information.

${confirmLink ? `
Please confirm your email address to get started:
${confirmLink}
` : ''}

What You Can Do:

📊 View Service Charge Rankings
Compare service charges across hotels and atolls

📝 Submit Your Data
Share your service charge information anonymously

🔒 Privacy Protected
Your email is never shared publicly

Visit our leaderboard: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}

Together we're building a more transparent industry.
Questions? Reach out to our support team.
    `.trim(),
  }
}
