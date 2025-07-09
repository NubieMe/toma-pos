import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSessionCookie } from '@/utils/session'
import { compare } from 'bcryptjs'
import { Session } from '@/types/session'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const user = await prisma.user.findUnique({
    where: { username },
    include: { role: true },
  })

  if (!user || !user.password) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }

  const isValid = await compare(password, user.password)
  if (!isValid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }

  const payload: Session = {
    id: user.id,
    username: user.username,
    role: {
      id: user.role?.id,
      name: user.role?.name,
    },
  }

  const res = NextResponse.json({ data: payload })
  const token = await createSessionCookie(payload)
  res.headers.append('Set-Cookie', token)
  return res
}
