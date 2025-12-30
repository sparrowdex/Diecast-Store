import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define the routes you want to protect
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)', // Protects /admin and any sub-pages
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // 1. Get the userId manually
    const { userId, redirectToSignIn } = await auth();

    // 2. If there is no user, force them to sign in
    if (!userId) {
      return redirectToSignIn();
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};