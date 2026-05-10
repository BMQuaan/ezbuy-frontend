// components/ManufacturersSection.tsx
"use client";

export default function ManufacturersSection() {
  const manufacturers = [
    { name: "Apple", logo: "/images/logo_manufacturer/apple.png" },
    { name: "Samsung", logo: "/images/logo_manufacturer/samsung.png" },
    { name: "Sony", logo: "/images/logo_manufacturer/sony.png" },
    { name: "Xiaomi", logo: "/images/logo_manufacturer/xiaomi.png" },
    { name: "Oppo", logo: "/images/logo_manufacturer/oppo.png" },
    { name: "Vivo", logo: "/images/logo_manufacturer/vivo.png" },
  ];

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Tiêu đề */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          Trusted by Leading Manufacturers
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-10">
          EZBuy proudly collaborates with top global brands to bring you the
          latest and most reliable products. Experience innovation from industry
          leaders like Apple, Samsung, Sony, Xiaomi, and more.
        </p>

        {/* Danh sách logo các hãng */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {manufacturers.map((brand) => (
            <div
              key={brand.name}
              className="flex flex-col items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-10 md:h-12 w-auto object-contain opacity-80 hover:opacity-100 transition"
              />
              <span className="mt-2 text-sm text-gray-500">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
