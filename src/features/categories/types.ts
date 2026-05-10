export type Category = {
  id: number;
  name: string;
  imageUrl: string;
  parentId: number;
  slug: string;
  active: boolean;
};

export type CategoryNode = {
  id: number;
  name: string;
  children?: CategoryNode[];
};

export type CategoryRef = Pick<Category, "id" | "name">;