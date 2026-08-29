import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export function proxy(request: NextRequest) {

    try {
        const token = request.cookies.get('token')?.value;
        const payload = jose.decodeJwt(token as string);

        const { email, role } = payload;
        const pathname = request.nextUrl.pathname;

        if (pathname.startsWith("/admin") && role === "admin") {
            return NextResponse.next();
        }
        else if (pathname.startsWith("/user") && role === "user") {
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL('/', request.url))
    } catch (error) {
        console.log("PROXY ERROR : ", error);
        return NextResponse.redirect(new URL('/', request.url))
    }
}

export const config = {
    matcher: ['/user/:path*', '/admin/:path*']
}