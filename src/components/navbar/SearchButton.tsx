"use client";

import { useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";

export default function SearchButton() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Khi nhấn icon
  const handleIconClick = () => {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // Khi nhấn Enter
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputRef.current?.value.trim()) {
      const query = inputRef.current.value.trim();
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  return (
    <div
      className="relative flex items-center text-primary"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        if (document.activeElement !== inputRef.current) setOpen(false);
      }}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      {/* Icon tìm kiếm */}
      <button
        type="button"
        onClick={handleIconClick}
        className="p-1 hover:text-primary-700 transition-colors"
        aria-label="Open search"
      >
        <CiSearch size={25} />
      </button>

      {/* Ô nhập */}
      <input
        ref={inputRef}
        type="search"
        placeholder="Search..."
        className={`absolute right-0 top-1/2 -translate-y-1/2 h-9 pl-3 pr-10 rounded-full border border-primary/30 text-sm bg-white text-black shadow-sm
          outline-none focus:border-primary focus:ring-2 focus:ring-primary/30
          transition-all duration-300 ease-in-out
          ${open ? "w-40 md:w-60 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}
        onKeyDown={handleSearch}
        onKeyUp={(e) => e.key === "Escape" && setOpen(false)}
        aria-label="Search"
      />
    </div>
  );
}
