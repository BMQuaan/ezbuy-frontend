import CategoryCarousel from "@/components/categorycarousel/CategoryCarousel";
import Hero from "@/components/hero/Hero";
import FeaturedProductsSection from "@/components/homepage/FeaturedProductsSection";
import LatestProductsSection from "@/components/homepage/LatestProductsSection";
import ManufacturersSection from "@/components/homepage/ManufacturersSection";
import { useEffect } from "react";

export default function Home() {
  
  return (
    <div className="bg-white">
      <Hero />
      <CategoryCarousel />
      <LatestProductsSection />
      <FeaturedProductsSection />
      <ManufacturersSection />
    </div>
  );
}
