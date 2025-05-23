import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/middleware'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

const PATH_PRIVELEGES = {
  '/pos': ['cashier', 'admin', 'owner', 'manager'],
  '/settings': ['cashier', 'admin', 'owner', 'manager'],
  '/dashboard': ['admin', 'owner', 'manager'],
  '/products': ['admin', 'owner', 'manager'],
  '/orders': ['admin', 'owner', 'manager'],
  '/customers': ['admin', 'owner', 'manager'],
  '/income': ['admin', 'owner', 'manager'],
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // console.log('sessions', session)

  const urlPath = req.nextUrl.pathname

  if (session) {
    // Prevent accessing login or register pages if user is authenticated

    const userRole = session.user?.user_metadata?.role

    console.log('USER ROLE', userRole)

    // Check if the user has access to the requested path
    const hasAccess = Object.keys(PATH_PRIVELEGES).some(path => {
      if (urlPath.startsWith(path)) {
        const allowedRoles =
          PATH_PRIVELEGES[path as keyof typeof PATH_PRIVELEGES]
        console.log('Allowed Roles:', allowedRoles)
        console.log('User Role:', userRole)
        return allowedRoles.includes(userRole)
      }
      return false
    })
    if (!hasAccess) {
      console.log(
        'Redirecting user to dashboard due to insufficient privileges',
      )
      return NextResponse.redirect(new URL('/pos', req.url))
    }

    if (['/login', '/register', '/'].includes(urlPath)) {
      console.log('Redirecting authenticated user away from login or register')
      return NextResponse.redirect(new URL('/dashboard', req.url)) // Redirect to home or dashboard
    }
  } else {
    // Redirect unauthenticated users to login if accessing protected routes
    if (!['/login', '/register', '/'].includes(urlPath)) {
      console.log('Redirecting unauthenticated user to login')
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
