import Image from "next/image";

export default function LatestProductsSection() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8">
      <div className="mx-auto max-w-6xl text-center">
        {/* Tiêu đề */}
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-600 mb-10">
          Discover the Latest Trends at EZBuy!
        </h2>

        <div className="relative h-[450px] w-full overflow-hidden rounded-lg">
          <Image
            alt=""
            src={"/images/hero/latest_product1.png"}
            fill
            className="object-contain"
          />
        </div>

        {/* Mô tả */}
        <p className="mt-10 text-base md:text-lg leading-relaxed text-gray-600 max-w-3xl mx-auto">
          At EZBuy, we’re committed to bringing you the newest and most exciting
          products on the market. Our collection is constantly updated to ensure
          you never miss out on the latest releases—from cutting-edge tech to
          stylish accessories. Be among the first to experience innovation with
          the brand-new{" "}
          <span className="font-semibold text-primary-600">iPhone 17</span>, now
          available at EZBuy.{" "}
          <span className="font-semibold text-gray-900">
            Shop the future today!
          </span>
        </p>
      </div>
    </section>
  );
}
