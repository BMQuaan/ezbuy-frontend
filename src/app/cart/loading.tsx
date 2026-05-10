// app/loading.tsx
"use client";

import Image from "next/image";

export default function GlobalLoading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Logo quay */}
        <div className="relative h-20 w-20">
          {/* vòng xoay */}
          <span className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          {/* logo ở giữa */}
          <div className="absolute inset-2 rounded-full flex items-center justify-center bg-white shadow">
            <Image
              src="/images/logo/ezbuy_logo.png"
              alt="EZPhone"
              width={56}
              height={56}
              priority
            />
          </div>
        </div>

        {/* dòng trạng thái */}
        <p className="text-sm md:text-base font-medium text-primary">
          Loading EZBuy…
        </p>

        {/* thanh tiến trình nhấp nháy nhẹ */}
        <div className="h-1 w-48 overflow-hidden rounded-full bg-primary/15">
          <span className="block h-full w-1/3 animate-[loader_1.2s_ease-in-out_infinite] bg-primary"></span>
        </div>
      </div>

      {/* Keyframes nhỏ gọn (Tailwind v3/v4 đều ổn thông qua arbitrary) */}
      <style jsx global>{`
        @keyframes loader {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}
