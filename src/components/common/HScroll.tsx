"use client";

import React, { useRef } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

type HScrollProps = {
  children: React.ReactNode;
  /** px mỗi lần cuộn; mặc định ~ card*1.2 */
  step?: number;
  /** Ẩn nút khi không thể cuộn thêm */
  autoHideButtons?: boolean;
};

export default function HScroll({
  children,
  step = 280,
  autoHideButtons = true,
}: HScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  const canScrollLeft = () => {
    const el = ref.current;
    if (!el) return false;
    return el.scrollLeft > 0;
  };
  const canScrollRight = () => {
    const el = ref.current;
    if (!el) return false;
    return el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
  };

  const scrollBy = (dx: number) => {
    ref.current?.scrollBy({ left: dx, behavior: "smooth" });
  };

  const showLeft = !autoHideButtons || canScrollLeft();
  const showRight = !autoHideButtons || canScrollRight();

  return (
    <div className="relative">
      {/* Nút trái */}
      {showLeft && (
        <button
          type="button"
          aria-label="Prev"
          onClick={() => scrollBy(-step)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                     rounded-full bg-white shadow p-1 border hover:bg-gray-50"
        >
          <IoChevronBack size={18} />
        </button>
      )}

      {/* Track cuộn ngang */}
      <div
        ref={ref}
        className="overflow-x-auto no-scrollbar px-7"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex gap-3">
          {/* Mỗi item cần shrink-0 để không co lại & bật snap */}
          {React.Children.map(children, (child, idx) => (
            <div
              key={idx}
              className="shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Nút phải */}
      {showRight && (
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollBy(step)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                     rounded-full bg-white shadow p-1 border hover:bg-gray-50"
        >
          <IoChevronForward size={18} />
        </button>
      )}
    </div>
  );
}
