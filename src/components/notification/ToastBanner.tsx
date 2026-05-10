"use client";

import { useEffect, useState } from "react";

type ToastBannerProps = {
  title: string;
  status: "success" | "error";
  duration?: number; // ms, mặc định 2000ms
};

export default function ToastBanner({
  title,
  status,
  duration = 2000,
}: ToastBannerProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={`
        fixed right-5 -translate-x-1/2 mt-2 z-50
        px-5 py-2 rounded-lg shadow-md text-sm font-medium transition-all duration-300
        ${status === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}
        top-25  
      `}
    >
      {title}
    </div>
  );
}
