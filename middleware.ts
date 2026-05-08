import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

const PUBLIC_ROUTES = ["/login", "/signup"]
const AUTH_ROUTES = ["/login", "/signup"]
const ONBOARDING_ROUTE = "/onboarding"
const DEFAULT_LOGIN_REDIRECT = "/dashboard"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isOnboardingComplete = req.auth?.user?.onboardingComplete ?? false

  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname)
  const isOnboardingRoute = nextUrl.pathname === ONBOARDING_ROUTE
  const isApiRoute = nextUrl.pathname.startsWith("/api")

  // Always allow API routes through
  if (isApiRoute) return NextResponse.next()

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthRoute) {
    if (!isOnboardingComplete) {
      return NextResponse.redirect(new URL(ONBOARDING_ROUTE, nextUrl))
    }
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  }

  // Redirect logged-in users who completed onboarding away from onboarding
  if (isLoggedIn && isOnboardingRoute && isOnboardingComplete) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  }

  // Redirect unauthenticated users away from protected routes
  if (!isLoggedIn && !isPublicRoute && !isOnboardingRoute) {
    const loginUrl = new URL("/login", nextUrl)
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
}
