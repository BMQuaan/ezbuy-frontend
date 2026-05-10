// middleware.ts (ở project root)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_HOME = "/admin/categories";

export function middleware(req: NextRequest) {
  const role = req.cookies.get("role")?.value || null;       // "ADMIN" | "CUSTOMER" | null
  const loggedIn = req.cookies.get("logged_in")?.value === "1";
  const url = req.nextUrl;
  const { pathname, searchParams } = url;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register";
   const isCartRoute = pathname.startsWith("/cart");
   const isCheckoutRoute = pathname.startsWith("/checkout");

  // Bỏ qua file tĩnh & API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // 1) Chưa đăng nhập: chặn /admin/**
  if (!loggedIn || !role) {
    if (isAdminRoute || isCartRoute || isCheckoutRoute) {
      const to = url.clone();
      to.pathname = "/login";
      to.searchParams.set(
        "redirect_url",
        pathname + (searchParams.toString() ? `?${searchParams}` : "")
      );
      return NextResponse.redirect(to);
    }
    return NextResponse.next();
  }

  // 2) Đã đăng nhập: cấm /login /register
  if (isAuthPage) {
    const to = url.clone();
    to.pathname = role === "ADMIN" ? ADMIN_HOME : "/";
    if (to.pathname === pathname) return NextResponse.next(); // chống loop
    return NextResponse.redirect(to);
  }

  // 3) ADMIN chỉ được vào /admin/**
  if (role === "ADMIN" && !isAdminRoute) {
    const to = url.clone();
    to.pathname = ADMIN_HOME;
    if (to.pathname === pathname) return NextResponse.next();
    return NextResponse.redirect(to);
  }

  // 4) CUSTOMER không được vào /admin/**
  if (role === "CUSTOMER" && isAdminRoute) {
    const to = url.clone();
    to.pathname = "/";
    if (to.pathname === pathname) return NextResponse.next();
    return NextResponse.redirect(to);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon|images|assets|api).*)"],
};
