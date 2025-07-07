import { NextResponse } from 'next/server'
import { destroySessionCookie } from '@/lib/session'

export async function POST() {
  return new NextResponse('Logged out', {
    status: 200,
    headers: {
      'Set-Cookie': destroySessionCookie(),
    },
  })

}
