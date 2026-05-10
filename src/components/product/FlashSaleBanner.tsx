"use client";

import Image from "next/image";
import { FaBolt } from "react-icons/fa";

interface ProductWithPromotionProps {
  name: string;
  image_url: string;
  price?: number; // có thể null/undefined
  description?: string;
  promotion_name?: string;
  promotion_price?: number; // có thể null/undefined
}

const formatCurrency = (price?: number) => {
  if (price == null || isNaN(price)) return "—";
  return price.toLocaleString("vi-VN");
};

export default function ProductPromotionCard({
  name,
  image_url,
  price,
  description,
  promotion_name,
  promotion_price,
}: ProductWithPromotionProps) {
  return (
    <div className="relative bg-card border border-border rounded-2xl shadow-md hover:shadow-lg transition-all p-5 flex items-center space-x-6 min-h-[200px]">
      {/* Badge khuyến mãi */}
      {promotion_name && (
        <div className="absolute -top-2 left-0 bg-danger text-white text-sm font-semibold px-3 py-1 rounded-br-lg rounded-tl-lg shadow-md flex items-center">
          <FaBolt className="mr-1" /> {promotion_name}
        </div>
      )}

      {/* Ảnh sản phẩm */}
      <div className="w-1/4 flex justify-center items-center">
        <div className="relative w-[120px] h-[120px]">
          <Image
            src={image_url || "/images/no-image.png"}
            alt={name}
            fill
            sizes="120px"
            className="object-contain rounded-md"
          />
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="w-2/4 flex flex-col justify-between h-full">
        <h2 className="text-lg font-bold text-primary-700 line-clamp-2 hover:underline cursor-pointer">
          {name}
        </h2>

        {description && (
          <p className="text-sm text-foreground/80 mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Giá và nút mua */}
      <div className="w-1/4 flex flex-col items-end">
        <div className="text-right">
          {promotion_price ? (
            <>
              <span className="text-danger font-extrabold text-2xl block">
                {formatCurrency(promotion_price)}đ
              </span>
              <span className="line-through text-secondary text-sm block mt-1">
                {formatCurrency(price)}đ
              </span>
            </>
          ) : (
            <span className="text-foreground font-bold text-2xl block">
              {formatCurrency(price)}đ
            </span>
          )}
        </div>

        <button className="mt-4 w-32 bg-primary hover:bg-primary-700 text-white font-semibold py-2 rounded-lg transition shadow-md">
          Mua ngay
        </button>
      </div>
    </div>
  );
}
