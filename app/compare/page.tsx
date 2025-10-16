import { Suspense } from 'react'
import { CompareContent } from '@/components/compare/compare-content'

export const metadata = {
  title: 'Compare Hotels | Service Charge Watch',
  description: 'Compare service charge payments across multiple hotels in the Maldives',
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompareContent />
    </Suspense>
  )
}
