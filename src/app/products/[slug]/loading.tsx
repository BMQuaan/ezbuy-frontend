// app/(store)/product/[slug]/loading.tsx
import Image from "next/image";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header with brand */}
      <div className="mb-8 flex items-center gap-3">
        <div className="relative h-8 w-8">
          <Image src="/images/logo/ezbuy_logo.png" alt="EZPhone" fill priority />
        </div>
        <span className="text-lg font-semibold text-primary">EZPhone</span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left: main image skeleton */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border">
            <div className="h-full w-full animate-pulse bg-gradient-to-br from-primary/10 via-white to-primary/5" />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl border">
                <div className="h-full w-full animate-pulse bg-primary/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: info skeleton */}
        <div className="space-y-5">
          <div className="h-8 w-3/4 animate-pulse rounded bg-primary/10" />
          <div className="h-4 w-40 animate-pulse rounded bg-primary/10" />

          {/* Price row */}
          <div className="flex items-end gap-3">
            <div className="h-10 w-48 animate-pulse rounded bg-primary/20" />
            <div className="h-6 w-28 animate-pulse rounded bg-primary/10" />
            <div className="h-6 w-16 animate-pulse rounded bg-primary/10" />
          </div>

          {/* badges */}
          <div className="flex gap-3">
            <div className="h-6 w-24 animate-pulse rounded-full bg-primary/10" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-primary/10" />
          </div>

          {/* short desc */}
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-primary/10" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-primary/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-primary/10" />
          </div>

          {/* quantity + actions */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-10 w-32 animate-pulse rounded-full border border-primary/20 bg-primary/5" />
            <div className="h-12 w-36 animate-pulse rounded-2xl bg-primary/80" />
            <div className="h-12 w-32 animate-pulse rounded-2xl border border-primary/30" />
          </div>

          {/* specs */}
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl border border-primary/10 bg-primary/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
