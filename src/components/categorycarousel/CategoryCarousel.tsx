"use client";

import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";

type Category = {
  id: number;
  name: string;
  imageUrl: string;
  parentId: number;
  slug: string;
  active: boolean;
};

export default function CategoryCarousel() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/categories`)
      .then((res) => {
        setCategories(res.data.data.content);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch API:", err);
      })
      .finally(() => setLoading(false));
  }, [API_URL]);

  console.log(categories);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12">
      <div className=" mb-3 flex items-end justify-between">
        <h2 className="text-lg lg:text-xl font-semibold text-foreground">
          CATEGORIES
        </h2>

        {/* Nút điều hướng (custom) */}
        <div className="flex items-center gap-2">
          <button
            className="cat-prev px-2 py-1 rounded-md border border-border text-foreground/70 hover:text-foreground hover:border-foreground/40 transition cursor-pointer"
            aria-label="Previous categories"
          >
            ←
          </button>
          <button
            className="cat-next px-2 py-1 rounded-md border border-border text-foreground/70 hover:text-foreground hover:border-foreground/40 transition cursor-pointer"
            aria-label="Next categories"
          >
            →
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        navigation={{ prevEl: ".cat-prev", nextEl: ".cat-next" }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        a11y={{ enabled: true }}
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 2.2 },
          480: { slidesPerView: 3 },
          640: { slidesPerView: 3.5 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
        className="!pb-8"
      >
        {!loading &&
          categories.map((cat) => (
            <SwiperSlide key={cat.id} aria-label={cat.name}>
              <CategoryCard {...cat}/>
            </SwiperSlide>
          ))}
      </Swiper>
    </section>
  );
}
