// "use client";
// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { refreshAccessToken } from "@/utils/axiosInstance";

// export default function SyncToken() {
//     const [_, forceUpdate] = useState(0);
//   useEffect(() => {
//     const cookieToken = Cookies.get("accessToken");
//     const localToken = localStorage.getItem("accessToken");
//     const user = localStorage.getItem("user");

//     if (cookieToken && !localToken) {
//       localStorage.setItem("accessToken", cookieToken);
//     }

//     // 2️⃣ Nếu đã có refreshToken mà chưa có user => gọi API refresh để lấy lại thông tin user
//     if ((cookieToken || localToken) && !user) {
//         refreshAccessToken()
//           .then((newToken) => {
//             if (newToken) {
//                 forceUpdate((x) => x + 1);
//               console.log(" Đã tự động lấy lại user sau reload");
//             } else {
//               console.warn(" Không thể tự lấy lại user, refresh token hết hạn");
//             }
//           })
//           .catch((err) => {
//             console.error("Lỗi khi tự refresh token:", err);
//           });
//     }

//   }, []);

//   return null;
// }
"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { refreshAccessToken } from "@/utils/axiosInstance";

export default function SyncToken() {
  const [ready, setReady] = useState(false);
  const [updated, setUpdated] = useState(0);

  useEffect(() => {
    const cookieToken = Cookies.get("accessToken");
    const localToken = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    // Nếu có cookie mà chưa có localStorage token → đồng bộ lại
    if (cookieToken && !localToken) {
      localStorage.setItem("accessToken", cookieToken);
    }

    const run = async () => {
      // Nếu có token mà chưa có user → refresh
      if ((cookieToken || localToken) && !user) {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            console.log("✅ Lấy lại user sau reload");
            // 🪄 Bắn event để header, layout, ... re-render
            window.dispatchEvent(new Event("auth:changed"));
            setUpdated((x) => x + 1);
          }
        } catch (err) {
          console.error("❌ Lỗi khi refresh:", err);
        }
      }
      setReady(true);
    };

    run();
  }, []);

  if (!ready && updated === 0) return null;

  return null;
}
