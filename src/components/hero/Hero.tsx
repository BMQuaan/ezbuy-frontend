"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Text Content */}
        <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-700 leading-tight">
            <span className="text-primary">EZBuy</span> – Your Trusted
            Store
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
            Discover the latest products at the best prices. Genuine
            products, easy installment plans, and 12-month warranty included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="/categories/1"
              className="px-6 py-3 rounded-2xl bg-primary text-white font-medium hover:bg-primary-700 transition"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-2xl border border-primary text-primary font-medium hover:bg-primary-50 transition"
            >
              Free Consultation
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 flex items-center justify-center">
          <Image
            src="/images/hero/iphone_mockup2.png"
            alt="Latest iPhone Mockup"
            width={420}
            height={420}
            className="w-full h-auto object-cover object-top"
            priority
          />
        </div>
      </div>
    </section>
  );
}
