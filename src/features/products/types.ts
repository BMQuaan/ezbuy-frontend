export type ProductClient = {
  id: number;
  name: string;
  description?: string;
  imageUrl: string;
  slug?: string;
  price: number;
  quantityInStock?: number;
  categoryName?: string;
  manufacturerId?: number;
  is_active?: boolean;
  manufacturerName?: string;
  categoryId?: number;
};
export type Product = {
  id: number;
  name: string;
  description?: string;
  imageUrl: string;
  slug?: string;
  price: number;
  quantityInStock?: number;
  categoryName?: string;
  manufacturerId?: number;
  is_active?: boolean;
  manufacturerName?: string;
  categoryId?: number;
};
