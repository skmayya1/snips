import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";


const PROTECTED_ROUTES = ["/dashboard", "/upload", "/editor", "/account", "/settings"];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some((route) => path.startsWith(route));

	const session = getSessionCookie(request);


  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (session && ["/sign-in", "/sign-up", "/reset-password", "/forgot-password"].includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
