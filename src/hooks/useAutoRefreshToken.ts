"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { refreshAccessToken, isTokenExpired } from "@/utils/axiosInstance";

export function useAutoRefreshToken() {
  useEffect(() => {
    // Chỉ chạy nếu người dùng đã từng đăng nhập
    const isLoggedIn =
      Cookies.get("logged_in") === "1" ||
      (typeof window !== "undefined" && !!localStorage.getItem("user"));

    if (!isLoggedIn) {
      return; // Khách vãng lai xem sản phẩm: KHÔNG làm gì, tránh bị redirect login
    }

    const token =
      Cookies.get("accessToken") ||
      (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null);

    const needRefresh = !token || isTokenExpired(token);

    if (needRefresh) {
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
