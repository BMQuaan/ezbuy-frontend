// Tuyệt đối không dùng any
export type Product = {
  id: number;
  name: string;
  description?: string;
  image_url: string;
  price: number;
  quantity_in_stock: number;
  category_id: number;
  manufacturer_id: number;
  slug: string;
};

// Ảnh nên nằm trong /public/images/... để cùng origin, tránh canvas bị "tainted"
export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Iphone 15 Promax",
    description: "6.7”, RAM 8GB, Battery 5000 mAh",
    image_url:"/images/promotions/Apple_iPhone_15_Pro_Max.jpg",
    price: 1299,
    quantity_in_stock: 12,
    category_id: 1,
    manufacturer_id: 1,
    slug: "ezphone-z-pro-128gb-black",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    description: "6.7”, RAM 12GB, Battery 5000 mAh",
    image_url: "/images/promotions/Samsung_Galaxy_S24_ULTRA_BLACK.jpg",
    price: 1499,
    quantity_in_stock: 8,
    category_id: 1,
    manufacturer_id: 1,
    slug: "ezphone-z-pro-256gb-blue",
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra",
    description: "6.1”, RAM 6GB, Battery 4200 mAh",
    image_url: "/images/promotions/Samsung_Galaxy_S24_ULTRA_BLACK.jpg",
    price: 799,
    quantity_in_stock: 30,
    category_id: 1,
    manufacturer_id: 1,
    slug: "ezphone-lite-128gb-white",
  },
];
