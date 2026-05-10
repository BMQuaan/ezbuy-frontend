"use client";

import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/cart/AddToCartButton";
// import { ProductRow } from "@/lib/redux/slices/cartSlice";
import { ProductClient } from "@/features/products/types";
import React, { useEffect, useState } from "react";
import axios from "axios";

// -------- Page --------
export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const [product, setProduct] = useState<ProductClient>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`
        );
        setProduct(res.data.data);
      } catch {}
    };

    fetchData();
  }, [slug]);

  console.log("product:", product);
  console.log("productMan:", product?.manufacturerName);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/" className="hover:underline">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product?.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            {product?.imageUrl && (
              <Image
                src={product?.imageUrl}
                alt={product?.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
          </div>
        </div>

        {/* Info (sticky) */}
        <div className="space-y-5 md:sticky md:top-20">
          <h1 className="text-2xl font-semibold tracking-tight">
            {product?.name}
          </h1>

          {/* Meta */}
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>Brand:</span>
            <span className="text-foreground">{product?.manufacturerName}</span>
            <span className="mx-2"> • </span>
            <span>Category:</span>
            <span className="text-foreground">{product?.categoryName}</span>
          </div>

          {/* Price + Stock */}
          <div className="flex items-end gap-3">
            <div className="text-3xl font-bold text-primary">
              {product?.price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${
                  Number(product?.quantityInStock) > 0
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-zinc-100 text-zinc-600"
                }`}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-current" />
                {Number(product?.quantityInStock) > 0
                  ? "In stock"
                  : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {product && <AddToCartButton product={product} />}
          </div>

          {/* Description */}
          {product?.description && (
            <div className="prose prose-zinc max-w-none">
              <h2 className="mb-3 text-lg font-semibold">Description</h2>
              <p>{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
