import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Defining types for the session claims metadata
interface CustomJwtPayload {
  metadata?: {
    role?: string;
  };
}

const isPublicRoute = createRouteMatcher([
  '/', 
  '/admin/welcome', 
  '/catalog(.*)', 
  '/journal(.*)', 
  '/api/journal(.*)', 
  '/api/uploadthing'
]);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // 1. Check if the user is trying to access an admin area
  if (isAdminRoute(request) && request.nextUrl.pathname !== '/admin/welcome') {
    const { sessionClaims } = await auth();
    
    // Casting sessionClaims to include our custom metadata type
    const claims = sessionClaims as unknown as CustomJwtPayload;

    if (claims?.metadata?.role !== 'admin') {
      const url = new URL('/admin/welcome', request.url);
      return NextResponse.redirect(url);
    }
  }

  // 2. Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};