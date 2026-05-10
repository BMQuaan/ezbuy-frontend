"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api/api";
import type { CategoryNode } from "@/features/categories/types";
import { axiosInstance } from "@/utils/axiosInstance";
// import { flattenCategories } from "@/features/categories/utils"; // hoặc copy hàm flatten ở trên

export interface CategoryOption {
  id: number;
  name: string;
}

export function flattenCategories(
  tree: CategoryNode[]
): { id: number; name: string }[] {
  const result: { id: number; name: string }[] = [];

  const dfs = (nodes: CategoryNode[]): void => {
    for (const node of nodes) {
      result.push({ id: node.id, name: node.name });
      if (node.children && node.children.length > 0) {
        dfs(node.children);
      }
    }
  };

  dfs(tree);
  return result;
}


export function useCategoriesTree() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTree = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosInstance.get<{ status: number; message: string; data: CategoryNode[] }>(
          "/categories/tree"
        );

        const tree = res.data.data;
        const flat = flattenCategories(tree);
        setCategories(flat);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, []);

  return { categories, loading, error };
}
