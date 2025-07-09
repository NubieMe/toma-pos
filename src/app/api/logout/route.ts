import { NextResponse } from 'next/server'
import { destroySessionCookie } from '@/utils/session'

export async function POST() {
  return new NextResponse('Logged out', {
    status: 200,
    headers: {
      'Set-Cookie': destroySessionCookie(),
    },
  })

}
