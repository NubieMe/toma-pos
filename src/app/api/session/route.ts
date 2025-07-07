import { NextRequest, NextResponse } from 'next/server'
import { getUserSessionFromRequest } from '@/lib/session'

export async function GET(req: NextRequest) {
  const data = getUserSessionFromRequest(req)

  if (!data) {
    return NextResponse.json({ data: null })
  }

  return NextResponse.json({ data })
}
