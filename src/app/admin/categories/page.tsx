"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

import api from "@/lib/api/api";
import { Modal } from "@/components/admin/Modal";

import { Category, CategoryNode } from "@/features/categories/types";
import { cx, errMsg } from "@/features/categories/utils";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { Th } from "@/components/admin/Th";
import Image from "next/image";
import { confirmCategoryAction } from "@/components/admin/categories/confirmCategoryAction";
import { notify } from "@/lib/notification/notistack";
import ReactPaginate from "react-paginate";
import { axiosInstance } from "@/utils/axiosInstance";

export default function CategoryManagerPage() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [parentNameCache, setParentNameCache] = useState<
    Record<number, string>
  >({});

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const idNameMap = useMemo(() => buildIdNameMap(tree), [tree]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosInstance.get(
          `/categories?page=${page}&size=${pageSize}&keyword=${appliedQuery}`
        );

        const content = res.data?.data?.content ?? [];
        const total = res.data?.data?.totalPages ?? 1;

        setData(content);
        setTotalPages(total);

        if (page >= total && total > 0) {
          setPage(0);
        }
      } catch (e: unknown) {
        setError(errMsg(e));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, pageSize, appliedQuery]);

  useEffect(() => {
    async function fetchMissingParents() {
      const missingIds = data
        .map((c) => c.parentId)
        .filter((id) => id && !parentNameCache[id]);

      if (missingIds.length === 0) return;

      const updatedCache = { ...parentNameCache };

      for (const id of missingIds) {
        const cached = idNameMap.get(id!);
        if (cached) {
          updatedCache[id!] = cached;
          continue;
        }

        try {
          const res = await axiosInstance.get(`/categories/${id}`);
          updatedCache[id!] = res.data?.data?.name ?? "—";
        } catch {
          updatedCache[id!] = "—";
        }
      }

      setParentNameCache(updatedCache);
    }

    if (data.length > 0) fetchMissingParents();
  }, [data, idNameMap, parentNameCache]);

  const handleDelete = async (id: number) => {
    try {
      const confirmed = await confirmCategoryAction("delete");
      if (!confirmed) return;
      await axiosInstance.delete(`/categories/${id}`);
      window.location.reload();
      notify("Delete succesfully", { variant: "success" });
    } catch {
      notify("Something went wrong", { variant: "error" });
    }
  };

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(cat: Category) {
    setEditing(cat);
    setOpen(true);
  }

  const handleSearch = () => {
    const q = query.trim();
    setAppliedQuery(q);
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p className="text-sm text-gray-600">
            Create, edit, delete and organize product categories.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:opacity-90 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th label="#" className="w-14" />
              <Th
                label="Name"
                // sortable
                // onClick={() => handleSort("name")}
                // active={sortKey === "name"}
                // asc={sortAsc}
              />
              <Th
                label="Slug"
                // sortable
                // onClick={() => handleSort("slug")}
                // active={sortKey === "slug"}
                // asc={sortAsc}
              />
              <Th label="Parent" />
              <Th label="Image" className="w-24" />
              <Th label="Actions" className="w-40" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {loading && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                  </span>
                </td>
              </tr>
            )}

            {!loading && !error && data.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No data
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              data.map((c, idx) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-3 text-center text-sm text-gray-500">
                    {page * pageSize + idx + 1}
                  </td>

                  <td className="p-3">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">ID: {c.id}</div>
                  </td>

                  <td className="p-3 text-sm text-gray-700">{c.slug}</td>

                  <td className="p-3 text-sm text-gray-700">
                    {parentNameCache[c.parentId] ?? "—"}
                  </td>

                  <td className="p-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden">
                      {c.imageUrl ? (
                        <Image
                          src={c.imageUrl}
                          alt={c.name}
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
                        onClick={() => openEdit(c)}
                        className="inline-flex items-center gap-1 rounded-xl border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        <Edit2 className="h-4 w-4" /> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
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
        title={editing ? "Edit Category" : "Add Category"}
      >
        <CategoryForm
          initial={editing ?? undefined}
          parents={data}
          submitting={submitting}
          onSubmit={async (fd) => {
            setSubmitting(true);
            try {
              if (editing) {
                const confirmed = await confirmCategoryAction("edit");
                if (!confirmed) return;
                await axiosInstance.put(`/categories/${editing.id}`, fd);
                window.location.reload();
                notify("Edit succesfully", { variant: "success" });
              } else {
                const confirmed = await confirmCategoryAction("add");
                if (!confirmed) return;
                await axiosInstance.post(`/categories`, fd);
                window.location.reload();
                notify("Add new category succesfully", { variant: "success" });
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

function buildIdNameMap(tree: CategoryNode[]): Map<number, string> {
  const map = new Map<number, string>();
  const dfs = (nodes: CategoryNode[]) => {
    for (const n of nodes) {
      map.set(n.id, n.name);
      if (n.children?.length) dfs(n.children);
    }
  };
  dfs(tree);
  return map;
}
