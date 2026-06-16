import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Pages accessibles sans connexion
  publicRoutes: ["/", "/sign-in", "/sign-up"],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
