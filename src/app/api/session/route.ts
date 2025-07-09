import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const data = JSON.parse(req.headers.get('x-user-payload')!)

  if (!data) {
    return NextResponse.json({ data: null })
  }

  return NextResponse.json({ data })
}
