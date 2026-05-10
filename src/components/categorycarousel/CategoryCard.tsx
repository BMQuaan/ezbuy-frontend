import Link from "next/link";
import Image from "next/image";

type Category = {
  id: number;
  name: string;
  imageUrl: string;
  parentId: number;
  slug: string;
  active: boolean;
};

const CategoryCard = (cat: Category) => {
  return (
    <div>
      <Link
        href={`/categories/${cat.id}`}
        className="group block rounded-2xl border border-border overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Khung ảnh: sử dụng tỉ lệ 4/5 để hợp với ảnh danh mục */}
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={cat.imageUrl}
            alt={cat.name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-contain object-center transition-transform duration-300 group-hover:scale-[1.04]"
            priority={false}
          />

          {/* Overlay gradient rất nhẹ để chữ luôn rõ nếu cần */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                bg-gradient-to-t from-primary/10 via-transparent to-transparent"
          />
        </div>

        {/* Tên danh mục */}
        <div className="p-3 flex items-center justify-center">
          <span
            className="text-sm font-medium text-foreground/90 
                             bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-400 group-hover:text-transparent"
          >
            {cat.name}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
