import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes are public. 
// We include '/admin/welcome' so the Welcome page can render without a redirect.
const isPublicRoute = createRouteMatcher(['/', '/admin/welcome', '/catalog(.*)', '/journal(.*)', '/api/journal(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request) && request.nextUrl.pathname !== '/admin/welcome') {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'admin') {
      const url = new URL('/admin/welcome', request.url);
      return Response.redirect(url);
    }
  }

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