"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RiMenu2Line } from "react-icons/ri";
import { CATALOG_ITEMS } from "@/constants/navbar";
import { Category } from "@/features/categories/types";
import axios from "axios";

export default function CatalogButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
        );
        setCategories(res.data.data.content);
      } catch {}
    };

    fetchData();
  }, []);

  console.log("mảng", categories);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") setOpen(true);
          if (e.key === "Escape") setOpen(false);
        }}
        className="flex items-center gap-2 px-6 py-2 border hover:border-primary-700 rounded-full 
                   text-primary hover:text-primary-700 transition cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <RiMenu2Line className="w-5 h-5" />
        <span className="font-[550] text-[15px] lg:text-[18px]">Catalog</span>
      </button>

      <div
        className={`absolute left-0 top-full mt-2 w-56 bg-white shadow-lg rounded-xl border border-gray-200
                    transition-all duration-200 ease-in-out z-50
                    ${
                      open ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                    } origin-top`}
        role="menu"
      >
        <ul className="py-2">
          {categories.map((item) => (
            <li key={item.id} role="none">
              <Link
                role="menuitem"
                href={`/categories/${item.id}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 rounded-md 
                           hover:text-white 
                           hover:bg-gradient-to-r hover:from-primary hover:to-primary-400"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
