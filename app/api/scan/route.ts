import { NextRequest, NextResponse } from 'next/server'
import { scanForVulnerabilities } from '@/lib/scanners/vulnerabilityScanner'

export async function POST(req: NextRequest) {
  try {
    const { url, scanTypes } = await req.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const startTime = Date.now()
    const vulnerabilities = await scanForVulnerabilities(url, scanTypes)
    const scanDuration = Date.now() - startTime

    return NextResponse.json({
      url,
      timestamp: new Date().toISOString(),
      scanDuration,
      vulnerabilities
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}