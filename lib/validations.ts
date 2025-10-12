import { z } from 'zod'

export const submissionSchema = z.object({
  hotelId: z.string().uuid('Please select a hotel'),
  month: z.number().min(1).max(12, 'Invalid month'),
  year: z.number().min(2020).max(2100, 'Invalid year'),
  usdAmount: z.number().min(0, 'USD amount must be positive').max(100000, 'Amount seems unusually high'),
  mvrAmount: z.number().min(0, 'MVR amount must be positive').max(2000000, 'Amount seems unusually high').optional().nullable(),
  position: z.string().min(1, 'Position is required').max(100),
  proofFile: z.instanceof(File).optional().nullable(),
})

export type SubmissionFormData = z.infer<typeof submissionSchema>
