import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/analytics", "/profile"];

// Routes only for unauthenticated users
const authRoutes = ["/auth/login", "/auth/signup"];

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request);
    const path = request.nextUrl.pathname;

    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isAuthRoute = authRoutes.some(route => path.startsWith(route));

    // Redirect unauthenticated users from protected routes to login
    if (isProtectedRoute && !user) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("next", path);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from auth routes to timer
    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL("/timer", request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
