'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface MonthOption {
  month: number
  year: number
  label: string
  isCurrent: boolean
}

interface MonthSelectorProps {
  availableMonths: MonthOption[]
  selectedMonth: number
  selectedYear: number
}

export function MonthSelector({ availableMonths, selectedMonth, selectedYear }: MonthSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleMonthChange = (value: string) => {
    const [month, year] = value.split('-')
    const params = new URLSearchParams(searchParams.toString())

    params.set('month', month)
    params.set('year', year)

    router.push(`/?${params.toString()}`)
  }

  const currentValue = `${selectedMonth}-${selectedYear}`
  const selectedLabel = availableMonths.find(
    m => m.month === selectedMonth && m.year === selectedYear
  )?.label || format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')

  return (
    <div className="flex items-center gap-3">
      <Calendar className="h-5 w-5 text-primary" />
      <Select value={currentValue} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[200px] font-semibold">
          <SelectValue>
            {selectedLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableMonths.map((option) => (
            <SelectItem
              key={`${option.month}-${option.year}`}
              value={`${option.month}-${option.year}`}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span>{option.label}</span>
                {option.isCurrent && (
                  <Badge variant="default" className="ml-2 text-xs">
                    Current
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
