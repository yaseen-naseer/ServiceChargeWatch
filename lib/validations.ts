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

// Hotel validation schemas
export const createHotelSchema = z.object({
  name: z.string().min(1, 'Hotel name is required').max(200, 'Name is too long'),
  atoll: z.string().min(1, 'Atoll is required').max(100, 'Atoll name is too long'),
  type: z.enum(['resort', 'city_hotel', 'guesthouse'], {
    message: 'Please select a valid hotel type'
  }),
  staff_count: z.union([
    z.number().int().min(1, 'Staff count must be at least 1').max(10000, 'Staff count seems unusually high'),
    z.null(),
  ]).optional(),
  status: z.enum(['active', 'closed']),
})

export const updateHotelSchema = z.object({
  name: z.string().min(1, 'Hotel name is required').max(200, 'Name is too long').optional(),
  atoll: z.string().min(1, 'Atoll is required').max(100, 'Atoll name is too long').optional(),
  type: z.enum(['resort', 'city_hotel', 'guesthouse'], {
    message: 'Please select a valid hotel type'
  }).optional(),
  staff_count: z.union([
    z.number().int().min(1, 'Staff count must be at least 1').max(10000, 'Staff count seems unusually high'),
    z.null(),
  ]).optional(),
  status: z.enum(['active', 'closed']).optional(),
})

export type CreateHotelFormData = z.infer<typeof createHotelSchema>
export type UpdateHotelFormData = z.infer<typeof updateHotelSchema>
