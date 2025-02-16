import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the user is authenticated, redirect them away from /api/auth/signin
  if (session && req.nextUrl.pathname.startsWith('/api/auth/signin')) {
    return NextResponse.redirect(new URL('/', req.url)); // Redirect to homepage or any other page
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/signin'],
};
