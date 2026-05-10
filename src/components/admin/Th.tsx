"use client";
import React from "react";
import { cx } from "@/features/categories/utils";

export function Th({
  label,
  sortable,
  onClick,
  active,
  asc,
  className,
}: {
  label: string;
  sortable?: boolean;
  onClick?: () => void;
  active?: boolean;
  asc?: boolean;
  className?: string;
}) {
  return (
    <th
      className={cx(
        "px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600",
        className
      )}
    >
      {sortable ? (
        <button onClick={onClick} className="inline-flex items-center gap-1">
          <span>{label}</span>
          <span className={cx("text-gray-400", active && "text-gray-800")}>
            {active ? (asc ? "▲" : "▼") : "↕"}
          </span>
        </button>
      ) : (
        <span>{label}</span>
      )}
    </th>
  );
}
