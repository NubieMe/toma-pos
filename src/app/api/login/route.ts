import { NextRequest, NextResponse } from 'next/server'
import { createSessionCookie } from '@/utils/session'
import { compare } from 'bcryptjs'
import { Session } from '@/types/session'
import { getUserByUsername } from '@/repositories/users.server'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const user = await getUserByUsername(username)
  if (!user || !user.password) {
    return NextResponse.json({ message: 'Username/Password tidak sesuai' }, { status: 401 })
  }

  const isValid = await compare(password, user.password)
  if (!isValid) {
    return NextResponse.json({ message: 'Username/Password tidak sesuai' }, { status: 401 })
  }

  const payload: Session = {
    id: user.id,
    username: user.username,
    role: {
      id: user.role?.id,
      name: user.role?.name,
    },
    profile: {
      picture: user.profile?.picture || null,
      name: user.profile?.name || '',
    },
    branch: {
      id: user.branch?.id || null,
    },
  }

  const res = NextResponse.json({ data: payload })
  const token = await createSessionCookie(payload)
  res.headers.append('Set-Cookie', token)
  return res
}
