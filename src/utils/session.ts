import { serialize } from 'cookie'
import { SignJWT, jwtVerify } from 'jose'
import { Session } from '@/types/session'
import config from '@/config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createSessionCookie(data: Session) {
  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(new TextEncoder().encode(config.secret_key))

  return serialize(config.session, token, {
    httpOnly: true,
    secure: config.production,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  })
}

export function destroySessionCookie() {
  return serialize(config.session, '', {
    httpOnly: true,
    secure: config.production,
    sameSite: 'lax',
    path: '/',
    maxAge: -1000,
  })
}

export async function getUserSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(config.session)?.value

  if (!token) return redirect('/login')

  try {
    return (await jwtVerify<Session>(token, new TextEncoder().encode(config.secret_key))).payload
  } catch (err) {
    console.error(err)
    return null
  }
}