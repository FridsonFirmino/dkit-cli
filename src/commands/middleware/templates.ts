export const middlewareTemplates = {
  middleware: `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // TODO: implement {{middlewareName}} logic
  // Example: check authentication, redirect, etc.

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
`,
}
