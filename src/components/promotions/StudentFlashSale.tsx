"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaBolt } from "react-icons/fa";

// ============================
// 1️⃣ Dữ liệu giả theo bảng promotions
// ============================
const promotions = [
  {
    id: 1,
    code: "STUDENT50",
    description: "Giảm ngay 50.000đ cho sinh viên.",
    discount_value: 50000,
    start_date: "2025-10-08T00:00:00Z",
    end_date: "2025-10-08T23:59:59Z",
    is_active: true,
    image_url: "/images/promotions/xiaomi_13t_pro.jpg",
    product_name: "Xiaomi 13T Pro",
    price: 15990000,
  },
  {
    id: 2,
    code: "IPHONE-SALE",
    description: "Giảm 300.000đ khi mua iPhone 15 hôm nay.",
    discount_value: 300000,
    start_date: "2025-10-08T00:00:00Z",
    end_date: "2025-10-09T00:00:00Z",
    is_active: true,
    image_url: "/images/promotions/Apple_iPhone_15_Pro_Max.jpg",
    product_name: "iPhone 15",
    price: 22990000,
  },
  {
    id: 3,
    code: "SAMSUNG-VIP",
    description: "Giảm thêm 500.000đ cho khách Smember.",
    discount_value: 500000,
    start_date: "2025-10-08T00:00:00Z",
    end_date: "2025-10-09T00:00:00Z",
    is_active: true,
    image_url: "/images/promotions/Samsung_Galaxy_S24_ULTRA_BLACK.jpg",
    product_name: "Samsung Galaxy S23 Ultra",
    price: 29990000,
  },
  {
    id: 4,
    code: "OPPO-PRO",
    description: "Ưu đãi 200.000đ cho dòng Reno 10 Pro.",
    discount_value: 200000,
    start_date: "2025-10-08T00:00:00Z",
    end_date: "2025-10-09T00:00:00Z",
    is_active: true,
    image_url: "/images/promotions/oppo_find_x6_pro.jpg",
    product_name: "OPPO Reno 10 Pro",
    price: 13990000,
  },
];

// ============================
// 2️⃣ Component định dạng giá
// ============================
const formatCurrency = (price?: number) => {
  if (!price) return "—";
  return price.toLocaleString("vi-VN");
};

// ============================
// 3️⃣ Component con: FlashSaleCard
// ============================
function FlashSaleCard({
  product_name,
  price,
  image_url,
  discount_value,
  description,
}: {
  product_name: string;
  price: number;
  image_url: string;
  discount_value: number;
  description: string;
}) {
  const discountedPrice = price - discount_value;

  return (
    <div className="relative flex items-center bg-card border border-border rounded-2xl shadow-md hover:shadow-xl transition-all p-5 space-x-5 min-h-[220px]">
      {/* Badge */}
      <div className="absolute -top-2 left-0 bg-danger text-white font-semibold text-sm px-3 py-1 rounded-br-lg rounded-tl-lg flex items-center shadow">
        <FaBolt className="mr-1" /> FLASH SALE
      </div>

      {/* Ảnh */}
      <div className="w-1/4 flex justify-center items-center">
        <div className="relative w-[120px] h-[120px]">
          <Image
            src={image_url || "/images/no-image.png"}
            alt={product_name}
            fill
            sizes="120px"
            className="object-contain rounded-lg"
          />
        </div>
      </div>

      {/* Thông tin */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-primary-700 line-clamp-2 hover:underline cursor-pointer">
          {product_name}
        </h3>
        <p className="text-sm text-foreground/80 mt-2 line-clamp-2">{description}</p>
      </div>

      {/* Giá */}
      <div className="w-1/4 flex flex-col items-end space-y-2">
        <span className="text-danger text-2xl font-extrabold">
          {formatCurrency(discountedPrice)}đ
        </span>
        <span className="line-through text-secondary text-sm">
          {formatCurrency(price)}đ
        </span>
        <span className="text-xs text-primary bg-primary-200 px-2 py-1 rounded font-semibold">
          Giảm {formatCurrency(discount_value)}đ
        </span>
        <button className="w-full bg-primary hover:bg-primary-700 text-white font-bold py-2 rounded-lg shadow-md transition">
          Mua ngay
        </button>
      </div>
    </div>
  );
}

// ============================
// 4️⃣ Component chính: FlashSale
// ============================
export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const duration = 6 * 60 * 60 * 1000;
    const endTime = new Date().getTime() + duration;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (t: number) => (t < 10 ? `0${t}` : t);

  return (
    <section className="mb-12 py-7 rounded-xl bg-muted">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-primary-700 py-2">
          🎓 Flash Sale for Students
        </h2>
      </div>

      {/* Timer */}
      <div className="mb-6 p-4 rounded-xl shadow-lg 
        bg-gradient-to-r from-primary-700 to-primary-400 
        text-white flex items-center justify-between">
        <span className="font-semibold">Kết thúc trong:</span>
        <div className="flex space-x-2 items-baseline">
          <span className="font-mono text-2xl font-bold text-danger bg-white px-3 py-1 rounded-lg shadow-inner">
            {formatTime(timeLeft.hours)}
          </span>
          <span className="text-2xl font-bold">:</span>
          <span className="font-mono text-2xl font-bold text-danger bg-white px-3 py-1 rounded-lg shadow-inner">
            {formatTime(timeLeft.minutes)}
          </span>
          <span className="text-2xl font-bold">:</span>
          <span className="font-mono text-2xl font-bold text-danger bg-white px-3 py-1 rounded-lg shadow-inner">
            {formatTime(timeLeft.seconds)}
          </span>
        </div>
      </div>

      {/* Lưới 2 thẻ/1 dòng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {promotions.map((p) => (
          <FlashSaleCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}
