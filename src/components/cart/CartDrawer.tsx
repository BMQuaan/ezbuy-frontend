"use client";
import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { GoTrash } from "react-icons/go";
import { useAppSelector } from "@/lib/redux/hook";
import {
  increaseQuantity,
  reduceQuantity,
  selectItemsArray,
  clearCart,
} from "@/lib/redux/slices/cartSlice";
import { useDispatch } from "react-redux";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useAppSelector(selectItemsArray);
  const dispatch = useDispatch();

  // lock scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  const currency = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[10000] ${open ? "flex" : "hidden"}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-card
        shadow-xl border-l border-border/60
        transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-secondary/70">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="rounded-xl px-3 py-1 text-sm hover:bg-secondary/40"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="flex h-[calc(100%-168px)] flex-col">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
              <div className="relative h-12 w-28 mb-3">
                <Image alt="EZPhone" src="/images/logo/ezbuy_logo.png" fill className="object-contain" />
              </div>
              <p className="text-base font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-600 mt-1">
                Browse our latest phones and accessories.
              </p>
              <Link
                href="/products"
                className="mt-4 rounded-2xl bg-primary px-4 py-2 text-primary-foreground hover:bg-primary-700"
                onClick={onClose}
              >
                Shop now
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex-1 overflow-y-auto divide-y divide-secondary">
                {items.map((it) => (
                  <li key={it.productId} className="p-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/product/${it.slug}`}
                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50"
                        onClick={onClose}
                      >
                        {it.imageUrl && (
                          <Image
                            src={it.imageUrl}
                            alt={it.name}
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/product/${it.slug}`}
                          className="line-clamp-1 text-[15px] font-medium hover:underline"
                          onClick={onClose}
                        >
                          {it.name}
                        </Link>
                        <div className="mt-1 text-sm text-secondary-700 font-semibold">
                          {currency(it.price)}
                        </div>
                        {/* Qty controls */}
                        <div className="mt-2 inline-flex items-center rounded-lg border">
                          <button
                            className="h-8 w-8 flex items-center justify-center"
                            onClick={() =>
                              dispatch(reduceQuantity({ productId: it.productId, step: 1 }))
                            }
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center text-sm font-semibold">
                            {it.qty}
                          </span>
                          <button
                            className="h-8 w-8 flex items-center justify-center"
                            onClick={() =>
                              dispatch(increaseQuantity({ productId: it.productId, step: 1 }))
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Line total + remove (optional) */}
                      <div className="text-right">
                        <div className="text-danger font-semibold">
                          {currency(it.qty * it.price)}
                        </div>
                        <button
                          className="mt-2 inline-flex items-center text-secondary hover:text-danger"
                          // Nếu bạn có action removeItem thì gọi ở đây
                          // onClick={() => dispatch(removeItem({ productId: it.productId }))}
                          title="Remove item"
                        >
                          <GoTrash />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Footer summary / actions */}
              <div className="border-t border-secondary/70 p-4 space-y-3">
                <div className="flex items-center justify-between text-[15px]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-danger">{currency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="flex gap-3 pt-1">
                  <Link
                    href="/cart"
                    className="flex-1 inline-flex items-center justify-center rounded-xl border px-4 py-2 font-medium hover:bg-secondary/40"
                    onClick={onClose}
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary-700"
                    onClick={onClose}
                  >
                    Checkout
                  </Link>
                </div>

                <button
                  className="w-full text-xs text-danger/90 hover:text-danger mt-1"
                  onClick={() => dispatch(clearCart())}
                >
                  Clear cart
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
