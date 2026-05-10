"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { refreshAccessToken } from "@/utils/axiosInstance";

export function useAutoRefreshToken() {
  useEffect(() => {
    const token = Cookies.get("accessToken") || localStorage.getItem("accessToken");

    // Nếu không có accessToken, thử refresh luôn
    if (!token) {
      refreshAccessToken()
        .then((newToken) => {
          if (newToken) {
            console.log("✅ Đã tự động tạo accessToken mới:", newToken);
          } else {
            console.warn("⚠️ Refresh token không tồn tại hoặc hết hạn");
          }
        })
        .catch((err) => {
          console.error("❌ Lỗi khi tự refresh token:", err);
        });
    }
  }, []);
}
