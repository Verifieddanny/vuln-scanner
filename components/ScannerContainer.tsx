'use client'

import { useState } from 'react'
import Scanner from './Scanner'
import Dashboard from './Dashboard'
import { ScanResult } from '@/lib/types'

export default function ScannerContainer() {
  const [scanResults, setScanResults] = useState<ScanResult | null>(null)

  return (
    <div className="space-y-8">
      <Scanner onScanComplete={setScanResults} />
      {scanResults && <Dashboard results={scanResults} />}
    </div>
  )
}