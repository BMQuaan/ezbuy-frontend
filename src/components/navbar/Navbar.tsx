"use client"

import { NAV_MENU } from "@/constants/navbar";
import Image from "next/image";
import Link from "next/link";
import CatalogButton from "./CatalogButton";
import SearchButton from "./SearchButton";
import CartButton from "../cart/CartButton";
import UserButton from "./UserButton";
import { useEffect, useState } from "react";

type User = {
  fullName: string;
  imageUrl: string | null;
  role: string;
  email: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const load = () => {
      const u = localStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
    };
    load();
    window.addEventListener("auth:changed", load);
    return () => window.removeEventListener("auth:changed", load);
  }, []);

  if (user && user.role === "ADMIN") return null;

  return (
    <nav
      className=" w-full sticky  top-0 left-0 z-50   bg-white/70 dark:bg-card/60
  bg-gradient-to-b from-primary-200/25 to-transparent
  backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md
  border-b border-border/60 shadow-sm"
    >
      <div className=" max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* group logo menu */}
        <div className="flex items-center flex-1 cursor-pointer">
          {/* logo */}
          <div className="relative h-12 w-28 sm:h-14 sm:w-32 md:h-16 md:w-36 lg:h-20 lg:w-40">
            <Image
              alt="EZPhone Logo"
              src="/images/logo/ezbuy_logo.png"
              width={230}
              height={230}
              className="object-contain"
              priority
            />
          </div>
          {/* menu */}
          <div className="flex items-center justify-between space-x-8">
            <CatalogButton />
            <div className="hidden md:flex space-x-10">
              {NAV_MENU.map((menu) => (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className="relative text-black font-[550] text-[15px] lg:text-[18px] group"
                >
                  {menu.label}
                  {/* underline custom */}
                  <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-primary rounded-full transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* nav button */}
        <div className="flex items-center space-x-3 md:space-x-9">
          <SearchButton />
          <CartButton />
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
