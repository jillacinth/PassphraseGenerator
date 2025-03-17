import { NextResponse } from "next/server";

export function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // Allow access to login and create user pages
    if (pathname === "/LoginPage" || pathname === "/create") {
        return NextResponse.next();
    }

    // Block access if not authenticated
    if (!req.cookies.authenticated) {
        return NextResponse.redirect(new URL("/LoginPage", req.url));
    }

    return NextResponse.next();
}
