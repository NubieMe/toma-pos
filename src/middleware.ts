// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { SESSION_NAME } from './lib/session'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_NAME)?.value
  const sidebarStr = req.cookies.get('sidecook')?.value
  const { pathname } = req.nextUrl
  const sidebar = sidebarStr ? JSON.parse(sidebarStr) : null
  
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url))
  } else if (!token && pathname === '/login') {
    return NextResponse.next()
  }

  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  } else if (token && (pathname === '/dashboard' || pathname === '/api/menu')) {
    return NextResponse.next()
  }

  if (sidebar && !sidebar.some((path: string) => pathname.startsWith("/" + path))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*|favicon.ico).*)'],
}