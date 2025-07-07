import { serialize } from 'cookie'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { Session } from '@/types/session'

export const SESSION_NAME = process.env.SESSION_NAME || 'auth_session'
export const SESSION_SECRET = process.env.SESSION_SECRET as string
export const isProd = process.env.NODE_ENV === 'production'

export function createSessionCookie(data: Session) {
  const token = jwt.sign(data, SESSION_SECRET, { expiresIn: '8h' })

  return serialize(SESSION_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  })
}

export function destroySessionCookie() {
  return serialize(SESSION_NAME, '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: -1000,
  })
}

export function getUserSessionFromRequest(req: NextRequest): Session | null {
  const cookie = req.cookies.get(SESSION_NAME)?.value

  if (!cookie) return null

  try {
    const decoded = jwt.verify(cookie, SESSION_SECRET)
    return decoded as Session
  } catch (err) {
    console.error(err)
    return null
  }
}