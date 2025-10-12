'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { exportSubmissionsToCSV, exportSCRecordsToCSV, exportHotelsToCSV } from '@/lib/utils/csv-export'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

type ExportType = 'submissions' | 'sc_records' | 'hotels' | 'all_submissions'

export function ExportButtons() {
  const [loading, setLoading] = useState<ExportType | null>(null)

  const handleExport = async (type: ExportType) => {
    setLoading(type)

    try {
      let endpoint = ''

      switch (type) {
        case 'submissions':
          endpoint = '/api/admin/export/submissions?status=pending'
          break
        case 'all_submissions':
          endpoint = '/api/admin/export/submissions'
          break
        case 'sc_records':
          endpoint = '/api/admin/export/sc-records'
          break
        case 'hotels':
          endpoint = '/api/admin/export/hotels'
          break
      }

      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const data = await response.json()

      // Call appropriate export function
      switch (type) {
        case 'submissions':
        case 'all_submissions':
          exportSubmissionsToCSV(data)
          break
        case 'sc_records':
          exportSCRecordsToCSV(data)
          break
        case 'hotels':
          exportHotelsToCSV(data)
          break
      }

      toast.success('Export successful', {
        description: `${type.replace('_', ' ')} exported to CSV`,
      })
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed', {
        description: 'Failed to export data. Please try again.',
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="hover-lift"
          disabled={loading !== null}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export to CSV</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('submissions')}>
          <Download className="mr-2 h-4 w-4" />
          Pending Submissions
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('all_submissions')}>
          <Download className="mr-2 h-4 w-4" />
          All Submissions
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('sc_records')}>
          <Download className="mr-2 h-4 w-4" />
          SC Records (Verified)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('hotels')}>
          <Download className="mr-2 h-4 w-4" />
          Hotels Database
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
