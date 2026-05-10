"use client";
import {useAutoRefreshToken} from "@/hooks/useAutoRefreshToken";

export default function AutoRefreshProvider() {
  useAutoRefreshToken();
  return null; // Không hiển thị gì, chỉ chạy hook
}
