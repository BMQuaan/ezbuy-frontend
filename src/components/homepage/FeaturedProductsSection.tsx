// components/FeaturedProductsSection.tsx
"use client";

import { ProductClient } from "@/features/products/types";
import api from "@/lib/api/api";
import { axiosInstance } from "@/utils/axiosInstance";
import Link from "next/link";
import { useEffect, useState } from "react";

const MANUFACTURERS = [
  { id: "1", name: "Sony" },
  { id: "2", name: "Apple" },
  { id: "3", name: "Xiaomi" },
  { id: "4", name: "Samsung" },
];

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<ProductClient[]>([]);
  const [selectedManufacturerId, setSelectedManufacturerId] = useState("2");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/products?manufacturerId=${selectedManufacturerId}&sortBy=id&sortDir=desc&page=0&size=4&keyword=`
        );
        setProducts(res.data.data.content);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedManufacturerId]);

  return (
    <section className="w-full bg-gray-50 py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Tiêu đề */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          Featured Products
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-8">
          Explore some of our latest and most innovative products.
        </p>

        {/* Bộ lọc theo nhãn hàng */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {MANUFACTURERS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedManufacturerId(m.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer
                ${
                  selectedManufacturerId === m.id
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-primary/50"
                }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Danh sách sản phẩm */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white border border-gray-100 rounded-xl p-4 h-56"
              >
                <div className="bg-gray-200 h-28 mb-4 rounded-md" />
                <div className="bg-gray-200 h-4 mb-2 rounded" />
                <div className="bg-gray-100 h-3 w-1/2 mx-auto rounded" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found for this brand.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="group bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-36 md:h-44 w-auto object-contain mb-4 group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="text-sm md:text-base font-medium text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {product.manufacturerName}
                </p>
                <p className="text-primary font-semibold text-sm md:text-base">
                  ${product.price}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
