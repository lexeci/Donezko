import {DASHBOARD_PAGES} from "@/src/pages-url.config";
import {EnumTokens} from "@/services/auth-token.service";
import {NextRequest, NextResponse} from "next/server";

/**
 * Middleware to handle access control based on authentication token.
 * Redirects users to the authentication page if no valid refresh token is found,
 * or redirects authenticated users away from the authentication page to the home page.
 *
 * @param {NextRequest} request - The incoming Next.js request object.
 * @returns {NextResponse} - The response object, either continuing the request or redirecting.
 */
export async function middleware(request: NextRequest) {
    const {url, cookies} = request;
    const refreshToken = cookies.get(EnumTokens.ACCESS_TOKEN)?.value;
    
    // Check if the request is for the authentication page
    const isAuthPage = url.includes("/auth");

    if (isAuthPage) {
        // If there is a refresh token, redirect to the home page
        if (refreshToken) {
            return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, url));
        }
        return NextResponse.next();
    }

    // For protected pages, redirect to /auth if there's no refresh token
    if (!refreshToken) {
        const response = NextResponse.redirect(new URL("/auth", url));
        response.cookies.delete(EnumTokens.REFRESH_TOKEN); // Optionally clear the token
        return response;
    }

    // Continue the request if the user is authenticated
    return NextResponse.next();
}

// Configuring the matcher for specific paths
export const config = {
    matcher: ["/workspace/:path*", "/auth/:path*"], // Matches workspace and auth routes
};
