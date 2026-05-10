"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Loader2,
  Image as ImageIcon,
  CircleX,
} from "lucide-react";
import { ProductClient } from "@/features/products/types";
import { Th } from "@/components/admin/Th";
import { Modal } from "@/components/admin/Modal";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { Category, CategoryNode } from "@/features/categories/types";
import api from "@/lib/api/api";
import Image from "next/image";
import { useCategoriesTree } from "@/components/admin/categories/useCategoriesTree";
import ReactPaginate from "react-paginate";
import { notify } from "@/lib/notification/notistack";
import { confirmProductAction } from "@/components/admin/products/confirmProductAction";
import { axiosInstance } from "@/utils/axiosInstance";

/* ============================= Page ============================= */
export default function ProductManagerPage() {
  const [data, setData] = useState<ProductClient[]>([]);
  // const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<ProductClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");

  const pageSize = 6;
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductClient | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { categories } = useCategoriesTree();

  const [selectedCatId, setSelectedCatId] = useState("");
  const [selectedManuId, setSelectedManuId] = useState("");
  // const [tree, setTree] = useState<CategoryNode[]>([]);

  // const idNameMap = useMemo(() => buildIdNameMap(tree), [tree]);
  // load mock
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [resProducts, resManufacturers] = await Promise.all([
          axiosInstance.get(
            `/products?categoryId=${selectedCatId}&manufacturerId=${selectedManuId}&page=${page}&size=${pageSize}&keyword=${appliedQuery}`
          ),
          // api.get("/api/categories"),
          axiosInstance.get("/manufacturers"),
        ]);
        const content = resProducts.data?.data?.content ?? [];
        const total = resProducts.data?.data?.totalPages ?? 1;

        setData(content);
        setManufacturers(resManufacturers.data.data);
        setTotalPages(total);

        if (page >= total && total > 0) {
          setPage(0);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, appliedQuery, selectedCatId, selectedManuId]);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(p: ProductClient) {
    setEditing(p);
    setOpen(true);
  }

  const handleDelete = async (id: number) => {
    try {
      const confirmed = await confirmProductAction("delete");
      if (!confirmed) return;
      await axiosInstance.delete(`/products/${id}`);
      window.location.reload();
      notify("Delete succesfully", { variant: "success" });
    } catch {
      notify("Something went wrong", { variant: "error" });
    }
  };

  const handleSearch = async () => {
    const q = query.trim();
    setAppliedQuery(q);
    setPage(0);
  };

  const onChangeCategory = (id: string) => {
    setSelectedCatId(id);
    setPage(0);
  };

  const onChangeManufacturer = (id: string) => {
    setSelectedManuId(id);
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-sm text-gray-600">
            Create, edit, delete and organize products.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Category */}
            <select
              value={selectedCatId ?? ""}
              onChange={(e) =>
                onChangeCategory(
                  e.target.value === "" ? "" : e.target.value
                )
              }
              className="rounded-xl border px-3 py-2 bg-white text-sm"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Manufacturer */}
            <select
              value={selectedManuId ?? ""}
              onChange={(e) =>
                onChangeManufacturer(
                  e.target.value === "" ? "" : e.target.value
                )
              }
              className="rounded-xl border px-3 py-2 bg-white text-sm"
            >
              <option value="">All manufacturers</option>
              {manufacturers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-60">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2 pr-10 focus:border-primary/6 focus:ring-2 focus:ring-primary outline-none"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary cursor-pointer"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th label="#" className="w-14" />
              <Th label="Name" />
              <Th label="Slug" />
              <Th label="Category" />
              <Th label="Manufacturer" />
              <Th label="Price" />
              <Th label="Stock" />

              <Th label="Image" className="w-24" />
              <Th label="Actions" className="w-44" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading && (
              <tr>
                <td colSpan={10} className="p-6 text-center text-gray-500">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                  </span>
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={10} className="p-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && data.length === 0 && (
              <tr>
                <td colSpan={10} className="p-6 text-center text-gray-500">
                  No data
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              data.map((p, idx) => (
                <tr key={p.id}>
                  <td className="p-3 text-center text-sm text-gray-500">
                    {page * pageSize + idx + 1}
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">ID: {p.id}</div>
                  </td>
                  <td className="p-3 text-sm text-gray-700">{p.slug}</td>
                  <td className="p-3 text-sm text-gray-700">
                    {p.categoryName}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {p.manufacturerName}
                  </td>
                  <td className="p-3 text-sm font-semibold">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {p.quantityInStock}
                  </td>
                  <td className="p-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="inline-flex items-center gap-1 rounded-xl border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        <Edit2 className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center ">
        <ReactPaginate
          breakLabel="…"
          nextLabel="Next ›"
          previousLabel="‹ Prev"
          onPageChange={({ selected }) => setPage(selected)}
          pageCount={totalPages}
          forcePage={page}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          containerClassName="flex items-center gap-1"
          pageLinkClassName="px-3 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50 cursor-pointer border-secondary-600"
          previousLinkClassName="px-3 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50 cursor-pointer border-secondary-600"
          nextLinkClassName="px-3 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50 cursor-pointer border-secondary-600"
          activeLinkClassName="!bg-[#0e7cc9] !text-white !border-[#0e7cc9]"
          disabledClassName="opacity-50 cursor-not-allowed"
          breakLinkClassName="px-2 text-gray-500 select-none"
        />
      </div>
      {/* Create/Edit Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Product" : "Add Product"}
      >
        <ProductForm
          initial={editing ?? undefined}
          categories={categories}
          manufacturers={manufacturers}
          submitting={submitting}
          onSubmit={async (fd) => {
            setSubmitting(true);
            try {
              if (editing) {
                const confirmed = await confirmProductAction("edit");
                if (!confirmed) return;
                await axiosInstance.put(`/products/${editing.id}`, fd);
                window.location.reload();
                notify("Edit succesfully", { variant: "success" });
              } else {
                const confirmed = await confirmProductAction("add");
                if (!confirmed) return;
                await axiosInstance.post(`/products`, fd);
                window.location.reload();
                notify("Add new product succesfully", { variant: "success" });
              }
              setOpen(false);
            } catch {
              notify("Something went wrong", { variant: "error" });
            } finally {
              setSubmitting(false);
            }
          }}
        />
      </Modal>
    </div>
  );
}
