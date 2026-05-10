// CategoryForm.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Category } from "@/features/categories/types";
import { cx, slugifyVi } from "@/features/categories/utils";

export function CategoryForm({
  initial,
  parents,
  onSubmit,       
  submitting,
}: {
  initial?: Partial<Category>;
  parents: Category[];
  onSubmit: (fd: FormData) => void;   
  submitting?: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [parentId, setParentId] = useState<number | "" | null>(initial?.parentId ?? "");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!initial?.id) setSlug(slugifyVi(name));
  }, [name, initial?.id]);

  const nameError = touched && !name.trim() ? "Category name is required" : "";

  const previewSrc = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : ""), [imageFile]);
  useEffect(() => () => { if (imageFile && previewSrc) URL.revokeObjectURL(previewSrc); }, [imageFile, previewSrc]);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (!name.trim()) return;

        const body = {
          name: name.trim(),
          slug: (slug.trim() || slugifyVi(name)).toLowerCase(),
          parentId: parentId === "" ? null : (parentId as number),
        };

        const fd = new FormData();
        fd.append("category", new Blob([JSON.stringify(body)], { type: "application/json" }));
        if (imageFile) {
          fd.append("file", imageFile);
        }
        

        onSubmit(fd);
      }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Category Name<span className="text-red-500"> *</span>
          </label>
          <input
            className={cx(
              "w-full rounded-xl border px-3 py-2 outline-none focus:ring-2",
              nameError ? "border-red-300 ring-red-200" : "border-gray-300 focus:ring-primary/30"
            )}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="e.g., Smartphones"
          />
          {nameError && <p className="mt-1 text-xs text-red-600">{nameError}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Slug</label>
          <input
            className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g., smartphones"
          />
        </div>

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewSrc} alt="preview" className="h-24 w-24 rounded-xl object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Parent</label>
          <select
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
            value={parentId === null ? "" : parentId}
            onChange={(e) => setParentId(e.target.value === "" ? "" : Number(e.target.value))}
          >
            <option value="">(None)</option>
            {parents
              .filter((p) => p.id !== initial?.id)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>
      </div>

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
