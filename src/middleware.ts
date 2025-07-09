import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import configs from '@/config';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(configs.session)?.value;

  if (pathname.startsWith('/api/')) {

    if (pathname.startsWith('/api/login')) {
      return NextResponse.next();
    }
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(configs.secret_key));
      
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-payload', JSON.stringify(payload));

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (err) {
      console.error('JWT Verification error for API route:', err);
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
  }
  
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  if (token && pathname === '/login' || pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (token) {
    const sidebarStr = req.cookies.get('sidecook')?.value;

    if (sidebarStr && pathname !== '/dashboard' && pathname !== '/') {
      const sidebar = JSON.parse(sidebarStr);

      if (!sidebar.some((path: string) => pathname.startsWith(`/${path}`))) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};