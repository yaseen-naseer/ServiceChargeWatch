import type { Tables } from '@/types/database.types'

type Submission = Tables<'submissions'>
type SCRecord = Tables<'sc_records'>
type Hotel = Tables<'hotels'>

interface SubmissionWithHotel extends Submission {
  hotels: Hotel
}

interface SCRecordWithHotel extends SCRecord {
  hotels: Hotel
}

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(',')

  const rows = data.map(row => {
    return headers.map(header => {
      const value = row[header]

      // Handle null/undefined
      if (value === null || value === undefined) {
        return ''
      }

      // Handle strings with commas or quotes
      if (typeof value === 'string') {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }

      // Handle numbers and booleans
      return String(value)
    }).join(',')
  })

  return [headerRow, ...rows].join('\n')
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Export submissions to CSV
 */
export function exportSubmissionsToCSV(submissions: SubmissionWithHotel[]) {
  const data = submissions.map(sub => ({
    id: sub.id,
    created_at: new Date(sub.created_at).toLocaleDateString(),
    hotel_name: sub.hotels.name,
    hotel_atoll: sub.hotels.atoll,
    hotel_type: sub.hotels.type,
    month: sub.month,
    year: sub.year,
    usd_amount: sub.usd_amount,
    mvr_amount: sub.mvr_amount || 0,
    position: sub.position || '',
    status: sub.status,
    submitter_email: sub.submitter_email,
    reviewed_at: sub.reviewed_at ? new Date(sub.reviewed_at).toLocaleDateString() : '',
    reviewed_by: sub.reviewed_by || '',
    rejection_reason: sub.rejection_reason || '',
  }))

  const headers = [
    'id',
    'created_at',
    'hotel_name',
    'hotel_atoll',
    'hotel_type',
    'month',
    'year',
    'usd_amount',
    'mvr_amount',
    'position',
    'status',
    'submitter_email',
    'reviewed_at',
    'reviewed_by',
    'rejection_reason',
  ]

  const csv = convertToCSV(data, headers)
  const filename = `submissions_${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}

/**
 * Export SC records to CSV
 */
export function exportSCRecordsToCSV(records: SCRecordWithHotel[]) {
  const data = records.map(record => ({
    id: record.id,
    hotel_name: record.hotels.name,
    hotel_atoll: record.hotels.atoll,
    hotel_type: record.hotels.type,
    month: record.month,
    year: record.year,
    usd_amount: record.usd_amount,
    mvr_amount: record.mvr_amount || 0,
    total_usd: record.total_usd || 0,
    verification_status: record.verification_status,
    verification_count: record.verification_count,
    verified_at: record.verified_at ? new Date(record.verified_at).toLocaleDateString() : '',
    verified_by: record.verified_by || '',
    created_at: new Date(record.created_at).toLocaleDateString(),
  }))

  const headers = [
    'id',
    'hotel_name',
    'hotel_atoll',
    'hotel_type',
    'month',
    'year',
    'usd_amount',
    'mvr_amount',
    'total_usd',
    'verification_status',
    'verification_count',
    'verified_at',
    'verified_by',
    'created_at',
  ]

  const csv = convertToCSV(data, headers)
  const filename = `sc_records_${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}

/**
 * Export hotels to CSV
 */
export function exportHotelsToCSV(hotels: Hotel[]) {
  const data = hotels.map(hotel => ({
    id: hotel.id,
    name: hotel.name,
    atoll: hotel.atoll,
    type: hotel.type,
    staff_count: hotel.staff_count || 0,
    status: hotel.status,
    created_at: new Date(hotel.created_at).toLocaleDateString(),
    updated_at: new Date(hotel.updated_at).toLocaleDateString(),
  }))

  const headers = [
    'id',
    'name',
    'atoll',
    'type',
    'staff_count',
    'status',
    'created_at',
    'updated_at',
  ]

  const csv = convertToCSV(data, headers)
  const filename = `hotels_${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}
