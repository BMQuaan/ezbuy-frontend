"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/features/products/types";
import { getAllProducts } from "@/features/products/services";
import { Category } from "@/features/categories/types";
import { getAllCategories } from "@/features/categories/services";

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories,setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(()=>{
    async function fetchCategories(){
      try{
        const data = await getAllCategories();
        setCategories(data);
      }catch(err){
        console.error("Failed to load categories:", err);
      }
    }
    fetchCategories();
  },[])

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getAllProducts({
          keyword: query,
          categoryId,
          page,
          size: 8,
          sortBy: "price",
          sortDir,
        });
        setProducts(data.content);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [query, page, sortDir, categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-primary">
        🔍 Search Results for "{query}"
      </h1>

      {/* Bộ lọc & sắp xếp */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="asc">Gradually Increase</option>
          <option value="desc">Gradually decrease</option>
        </select>

        <select
          value={categoryId ?? ""}
          onChange={(e) =>
            setCategoryId(e.target.value ? Number(e.target.value) : undefined)
          }
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
            <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
            </option>))}
        </select>
      </div>

      {/* Kết quả */}
      {products.length === 0 ? (
        <p className="text-gray-500 italic text-center">
          No products found for “{query}”.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} imageUrl={p.imageUrl} />
          ))}
        </div>
      )}

      {/* Phân trang */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-600">
          Page {page + 1} / {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
