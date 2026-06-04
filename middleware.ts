
import { NextRequest, NextResponse } from "next/server" 

export function middleware(request: NextRequest) {
  
  let cookie = request.cookies.get('auth_token')

   const { pathname } = request.nextUrl
   if(pathname.startsWith("/home")&&!cookie){
    return NextResponse.redirect(new URL('/', request.url))
   }
    
    return  NextResponse.next()
  
}
export const config = {
  matcher: ['/home/:path*',],
}