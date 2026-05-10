"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { cx, slugifyVi } from "@/features/categories/utils";
import type { Manufacturer } from "@/features/manufacturers/types";
import type { ProductClient } from "@/features/products/types";
import type { CategoryRef } from "@/features/categories/types";

export function ProductForm({
  initial,
  categories,
  manufacturers,
  onSubmit,
  submitting,
}: {
  initial?: Partial<ProductClient>;
  categories: CategoryRef[];
  manufacturers: Manufacturer[];
  onSubmit: (fd: FormData) => void;
  submitting?: boolean;
}) {
  // ====== STATES ======
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState<string>(
    initial?.price != null ? String(initial.price) : ""
  );
  const [quantityInStock, setQuantityInStock] = useState<string>(
    initial?.quantityInStock != null ? String(initial.quantityInStock) : ""
  );

  const [categoryId, setCategoryId] = useState<number | "">(
    initial?.categoryId ?? ""
  );
  const [manufacturerId, setManufacturerId] = useState<number | "">(
    initial?.manufacturerId ?? ""
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);

  // ====== Auto slug ======
  useEffect(() => {
    if (!initial?.id) setSlug(slugifyVi(name));
  }, [name, initial?.id]);

  // ====== Nếu initial chỉ có name, map sang id ======
  useEffect(() => {
    if ((categoryId === "" || categoryId == null) && initial?.categoryName) {
      const found = categories.find((c) => c.name === initial.categoryName);
      if (found) setCategoryId(found.id);
    }
    if ((manufacturerId === "" || manufacturerId == null) && initial?.manufacturerName) {
      const found = manufacturers.find((m) => m.name === initial.manufacturerName);
      if (found) setManufacturerId(found.id);
    }
  }, [categories, manufacturers, initial, categoryId, manufacturerId]);

  // ====== Validation ======
  const nameError = touched && !name.trim() ? "Product name is required" : "";
  const priceError =
    touched && (price === "" || Number(price) < 0)
      ? "Price must be a non-negative number"
      : "";
  const qtyError =
    touched && (quantityInStock === "" || Number(quantityInStock) < 0)
      ? "Quantity must be non-negative"
      : "";

  // 🔴 Thêm lỗi bắt buộc chọn category và manufacturer
  const categoryError =
    touched && (categoryId === "" || categoryId == null)
      ? "Please select a category"
      : "";
  const manufacturerError =
    touched && (manufacturerId === "" || manufacturerId == null)
      ? "Please select a manufacturer"
      : "";

  // ====== Preview ảnh ======
  const previewSrc = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return initial?.imageUrl || "";
  }, [imageFile, initial?.imageUrl]);

  useEffect(() => {
    return () => {
      if (imageFile && previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, [imageFile, previewSrc]);

  // ====== Submit ======
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);

    // 🔴 Chặn submit nếu có bất kỳ lỗi nào
    if (nameError || priceError || qtyError || categoryError || manufacturerError) return;

    const productBody = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      quantityInStock: Number(quantityInStock),
      categoryId: categoryId === "" ? null : Number(categoryId),
      manufacturerId: manufacturerId === "" ? null : Number(manufacturerId),
      slug: (slug.trim() || slugifyVi(name)).toLowerCase(),
    };

    const fd = new FormData();
    fd.append(
      "product",
      new Blob([JSON.stringify(productBody)], { type: "application/json" })
    );
    if (imageFile) fd.append("file", imageFile);

    onSubmit(fd);
  };

  // ====== JSX ======
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Product Name<span className="text-red-500"> *</span>
          </label>
          <input
            className={cx(
              "w-full rounded-xl border px-3 py-2 outline-none focus:ring-2",
              nameError
                ? "border-red-300 ring-red-200"
                : "border-gray-300 focus:ring-primary/30"
            )}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="e.g., Samsung Galaxy Z Fold6"
          />
          {nameError && (
            <p className="mt-1 text-xs text-red-600">{nameError}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="mb-1 block text-sm font-medium">Slug</label>
          <input
            className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g., samsung-galaxy-z-fold6"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short product description..."
          />
        </div>

        {/* Price */}
        <div>
          <label className="mb-1 block text-sm font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className={cx(
              "w-full rounded-xl border px-3 py-2 outline-none focus:ring-2",
              priceError
                ? "border-red-300 ring-red-200"
                : "border-gray-300 focus:ring-primary/30"
            )}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 3490.00"
          />
          {priceError && (
            <p className="mt-1 text-xs text-red-600">{priceError}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Quantity in Stock
          </label>
          <input
            type="number"
            min="0"
            className={cx(
              "w-full rounded-xl border px-3 py-2 outline-none focus:ring-2",
              qtyError
                ? "border-red-300 ring-red-200"
                : "border-gray-300 focus:ring-primary/30"
            )}
            value={quantityInStock}
            onChange={(e) => setQuantityInStock(e.target.value)}
            placeholder="e.g., 10"
          />
          {qtyError && <p className="mt-1 text-xs text-red-600">{qtyError}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            className={cx(
              "w-full rounded-xl border bg-white px-3 py-2 outline-none focus:ring-2",
              categoryError
                ? "border-red-300 ring-red-200"
                : "border-gray-300 focus:ring-primary/30"
            )}
            value={categoryId === "" ? "" : categoryId}
            onChange={(e) =>
              setCategoryId(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          >
            <option value="">(Select category)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {categoryError && (
            <p className="mt-1 text-xs text-red-600">{categoryError}</p>
          )}
        </div>

        {/* Manufacturer */}
        <div>
          <label className="mb-1 block text-sm font-medium">Manufacturer</label>
          <select
            className={cx(
              "w-full rounded-xl border bg-white px-3 py-2 outline-none focus:ring-2",
              manufacturerError
                ? "border-red-300 ring-red-200"
                : "border-gray-300 focus:ring-primary/30"
            )}
            value={manufacturerId === "" ? "" : manufacturerId}
            onChange={(e) =>
              setManufacturerId(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          >
            <option value="">(Select manufacturer)</option>
            {manufacturers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          {manufacturerError && (
            <p className="mt-1 text-xs text-red-600">{manufacturerError}</p>
          )}
        </div>

        {/* Image */}
        <div>
          <label className="mb-1 block text-sm font-medium">Image (File)</label>
          <input
            type="file"
            accept="image/*"
            className="block w-full rounded-xl border border-gray-300 px-3 py-2"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
          {previewSrc && (
            <div className="mt-2">
              <img
                src={previewSrc}
                alt="preview"
                className="h-24 w-24 rounded-xl object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Save</span>
        </button>
      </div>
    </form>
  );
}
