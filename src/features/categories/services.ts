import {Category} from '@/features/categories/types';

const API_URL =  "http://localhost:8081/api/categories";
// process.env.NEXT_PUBLIC_API_URL ||
export async function getAllCategories(): Promise<Category[]> {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch categories");
  
    const data = await res.json();

     // Dòng này đảm bảo luôn trả về mảng
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data?.content)) return data.data.content;
    
    return [];
}
