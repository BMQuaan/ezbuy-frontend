// components/promotions/CampaignHero.tsx

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Campaign() {
  return (
    <section className="relative w-full h-[550px] mb-16 rounded-3xl overflow-hidden shadow-2xl bg-white border border-border">
      <div className="flex h-full">
        
        <div className="w-full lg:w-6/12 flex flex-col justify-center text-left p-8 md:p-12 lg:p-16">
          
          <span className="
            inline-block bg-danger text-white text-sm md:text-base 
            font-bold px-4 py-2 rounded-full mb-4 shadow-lg 
            w-fit
          ">
             BIGGEST SALE OF THE YEAR
          </span>

          {/* Tiêu đề chính */}
          <h1 className="
            text-3xl sm:text-4xl lg:text-5xl font-extrabold 
            leading-tight mb-3 text-primary-700
          ">
            MEGA PROMOTION <span className="text-danger">2025</span> 
          </h1>
          
          <p className="
            text-lg md:text-xl font-medium mb-10 max-w-lg text-secondary-600
          ">
            Get massive discounts on **all the latest flagship phones**. Plus, receive exclusive gifts worth **$50** when shopping at EZBuy!
          </p>

          <Link 
            href="/promotions/summer-sale" 
            className="
              inline-flex items-center justify-center gap-3 
              bg-primary hover:bg-primary-600 
              text-white text-lg font-bold 
              px-10 py-4 rounded-full shadow-xl 
              transition-all duration-300 transform hover:scale-105 
              w-fit
            "
          >
            <span>EXPLORE NOW</span>
            <FaArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="hidden lg:block lg:w-6/12 relative bg-primary-50 rounded-r-3xl overflow-hidden">
            <div className="absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'radial-gradient(#00000010 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            ></div>

            <Image
              src="/images/promotions/banner_Iphone17.jpg" 
              alt="iPhone 17 Pro Max Promotion"
              layout="fill"
              objectFit="contain" 
              quality={95}
              className="
                p-8 transition-all duration-700 transform 
                hover:scale-105
              " 
            />
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full"></div>
        </div>

      </div>
    </section>
  );
}