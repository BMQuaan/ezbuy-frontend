import { ProductClient } from "./types"
import axios from "axios";

const API_URL = "http://localhost:8081/api/products"
// process.env.NEXT_PUBLIC_API_URL ||
// export async function getAllProducts(): Promise<Product[]> {
//   const res = await fetch(API_URL, { cache: "no-store" })
//   if (!res.ok) throw new Error("Failed to fetch products")

//   const data = await res.json()
//   return data.data?.content ?? data.data ?? []
// }

interface GetProductParams {
  keyword?: string
  categoryId?: number
  manufacturerId?: number
  page?: number
  size?: number
  sortBy?: string
  sortDir?: "asc" | "desc"
}

interface ProductPage {
  content: ProductClient[]
  totalPages: number
  totalElements: number
  page: number
}

export async function getAllProducts(params: GetProductParams = {}): Promise<ProductPage> {
  try {
    const res = await axios.get(API_URL, { params });
    const pageData = res.data?.data ?? {};

    return {
      content: pageData.content ?? [],
      totalPages: pageData.totalPages ?? 1,
      totalElements: pageData.totalElements ?? 0,
      page: pageData.page ?? 0,
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error("Failed to fetch products");
  }
}


// export async function getAllProducts(params: GetProductParams = {}): Promise<ProductPage> {
//   const queryString = new URLSearchParams(
//     Object.entries(params)
//       .filter(([_, v]) => v !== undefined && v !== null)
//       .map(([k, v]) => [k, String(v)])
//   ).toString()

//   const res = await fetch(`${API_URL}?${queryString}`, { cache: "no-store" })
//   if (!res.ok) throw new Error("Failed to fetch products")

//   const data = await res.json()
//   const pageData = data.data ?? {}

//   return {
//     content: pageData.content ?? [],
//     totalPages: pageData.totalPages ?? 1,
//     totalElements: pageData.totalElements ?? 0,
//     page: pageData.page ?? 0
//   }
// }

// export async function getProductById(id: number): Promise<Product> {
//   const res = await fetch(`${API_URL}/${id}`, { cache: "no-store" })
//   if (!res.ok) throw new Error("Failed to fetch product")
//   const data = await res.json()
//   return data.data
// }
