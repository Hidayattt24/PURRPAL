import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = [
  '/main/ai',
  '/main/modul',
  '/main/chatbot',
  '/main/map',
  '/main/settings',
  '/main/home'
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const currentPath = request.nextUrl.pathname

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    currentPath.startsWith(route)
  )

  if (isProtectedRoute && !token) {
    // Redirect to login page with return URL
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('returnUrl', currentPath)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    '/main/:path*', // Apply to all routes under /main
  ]
} 