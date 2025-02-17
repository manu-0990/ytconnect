import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {

    const path = req.nextUrl.pathname;
    const publicPath = ['/', '/api/auth/signin', ];
    const isPublicPath = publicPath.includes(path);

    const sessionToken = req.cookies.get('next-auth.session-token')?.value || req.cookies.get('__Secure-next-auth.session-token')?.value;

    if (isPublicPath && sessionToken) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (!isPublicPath && !sessionToken) {
        return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/auth/signin',
        '/',
    ],
};