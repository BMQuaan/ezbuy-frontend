"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

type Role = "ADMIN" | "CUSTOMER";

function readAuth() {
  try {
    const token = localStorage.getItem("accessToken");
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;
    const role: Role | undefined = user?.role;
    return { token, role };
  } catch {
    return { token: null, role: undefined };
  }
}

export default function GlobalRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Tránh chạy lặp vô hạn cùng 1 URL
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname || null;

    const { token, role } = readAuth();

    const isAdminRoute = pathname?.startsWith("/admin");
    const isAuthPage = pathname === "/login" || pathname === "/register";

    // 1) Chưa đăng nhập: chặn /admin/**
    if (!token || !role) {
      if (isAdminRoute) {
        router.replace(`/login?redirect_url=${encodeURIComponent(pathname || "/admin")}`);
      }
      return;
    }

    // 2) Đã đăng nhập: chặn /login /register
    if (isAuthPage) {
      router.replace(role === "ADMIN" ? "/admin" : "/");
      return;
    }

    // 3) ADMIN chỉ ở /admin/**
    if (role === "ADMIN" && !isAdminRoute) {
      router.replace("/admin");
      return;
    }

    // 4) CUSTOMER không được vào /admin/**
    if (role === "CUSTOMER" && isAdminRoute) {
      router.replace("/");
      return;
    }
  }, [pathname, router]);

  // Guard không render gì, chỉ làm nhiệm vụ redirect
  return null;
}
