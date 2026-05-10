// app/(store)/product/[slug]/not-found.tsx
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      {/* Brand logo in a soft ring */}
      <div className="mb-6 rounded-full p-4 ring-8 ring-primary/10">
        <div className="relative h-14 w-14">
          <Image src="/images/logo/ezbuy_logo.png" alt="EZPhone" fill priority />
        </div>
      </div>

      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
        Product not found
      </h1>
      <p className="mb-6 text-balance text-[15px] leading-6 text-muted-foreground">
        Sorry, we couldn’t find the product you’re looking for. It may have been moved
        or is no longer available.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/product"
          className="rounded-2xl bg-primary px-5 py-3 text-primary-foreground shadow-sm transition hover:bg-primary-700"
        >
          Browse products
        </Link>
        <Link
          href="/"
          className="rounded-2xl border border-primary/40 px-5 py-3 text-primary transition hover:border-primary hover:text-primary-700"
        >
          Back to home
        </Link>
      </div>

      {/* Decorative gradient bar */}
      <div className="mt-10 h-1 w-32 rounded-full bg-gradient-to-r from-primary via-primary/60 to-primary/30" />
    </div>
  );
}
