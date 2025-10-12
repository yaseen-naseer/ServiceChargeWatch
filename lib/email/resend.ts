import { Resend } from 'resend'

// Initialize Resend client
// Get API key from environment variable
// Use a dummy key if not configured to prevent initialization errors
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key')

export default resend
