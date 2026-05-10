"use client";
import { addToCartServer } from "@/lib/redux/slices/cartSlice";

import React from "react";
import { ProductClient } from "@/features/products/types";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hook";

const AddToCartButton = ({ product }: { product: ProductClient }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const addItemHandle = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await dispatch(addToCartServer({ product, qty: 1 })).unwrap();
    } catch (e) {
      throw e;
    }
  };

  return (
    <div>
      <button
        onClick={addItemHandle}
        className={`
    rounded-2xl px-6 py-3 text-primary-foreground shadow-sm transition
    ${
      product.quantityInStock === 0
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-primary hover:bg-primary-700 cursor-pointer"
    }
  `}
        disabled={product.quantityInStock === 0}
      >
        Add to cart
      </button>
    </div>
  );
};

export default AddToCartButton;
