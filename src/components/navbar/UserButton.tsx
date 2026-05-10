"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

type User = {
  fullName: string;
  imageUrl: string | null;
  role: string;
  email: string;
};

export default function UserButton() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Load user từ localStorage khi mount
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        console.error("Invalid user JSON in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("auth:changed", handleAuthChange);
    handleAuthChange(); // Gọi 1 lần ban đầu
    return () => window.removeEventListener("auth:changed", handleAuthChange);
  }, []);

  // Lắng nghe thay đổi auth và popstate để reload user (nếu bạn cần)
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("user");
      setUser(saved ? JSON.parse(saved) : null);
    };
    load();
    window.addEventListener("auth:changed", load);
    window.addEventListener("popstate", load);
    return () => {
      window.removeEventListener("auth:changed", load);
      window.removeEventListener("popstate", load);
    };
  }, []);

  // Đóng menu khi điều hướng sang route khác
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Click outside để đóng menu (thay cho onBlur)
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 text-primary hover:text-primary-700 transition"
      >
        <IoPersonOutline className="w-5 h-5 md:w-6 md:h-6" />
        <span className="hidden md:block font-[550] text-[15px] lg:text-[18px]">
          Login
        </span>
      </Link>
    );
  }

  const avatarSrc = user.imageUrl || "/images/profile/default-avatar.jpg";

  const logOutHandle = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {
      /* ignore network error on logout */
    });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refresh_token", { path: "/" });
    document.cookie = "role=; Path=/; Max-Age=0; SameSite=Lax";
    document.cookie = "logged_in=; Path=/; Max-Age=0; SameSite=Lax";

    window.dispatchEvent(new Event("auth:changed"));
    window.location.href = "/login";
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 group cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="user-menu"
      >
        <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-border">
          <Image
            src={avatarSrc}
            alt={user.fullName || "User avatar"}
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
        <span className="hidden md:block font-[550] text-[15px] lg:text-[18px] text-primary group-hover:text-primary-700">
          {user.fullName}
        </span>
      </button>

      {open && (
        <div
          id="user-menu"
          role="menu"
          className="absolute right-0 mt-2 w-44 bg-white dark:bg-card border border-border rounded-xl shadow-lg p-2 z-50 cursor-pointer"
        >
          <Link
            href="/profile"
            className="block px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-primary hover:to-primary-400 hover:text-white cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/profile/purchasehistory"
            className="block px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-primary hover:to-primary-400 hover:text-white cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Orders
          </Link>
          <button
            className="w-full text-left px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-primary hover:to-primary-400 hover:text-white cursor-pointer"
            onClick={logOutHandle}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
