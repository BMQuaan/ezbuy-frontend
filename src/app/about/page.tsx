"use client";

import { useState } from "react";

const sections = [
  { id: "intro", title: "1. Introduction" },
  { id: "founders", title: "2. Founding Team" },
  { id: "products", title: "3. Products & Services" },
  { id: "mission", title: "4. Mission" },
  { id: "values", title: "5. Core Values" },
  { id: "future_direction", title: "6. Future Direction" },
];

export default function AboutPage() {
  const [active, setActive] = useState("intro");

  return (
    <main className="flex max-w-6xl mx-auto px-6 py-12 gap-5">
      <aside className="w-1/5 bg-gray-100 rounded-lg p-6 self-start">
        <h2 className="text-xl font-semibold mb-4">Policy Sections</h2>
        <ul className="space-y-5">
          {sections.map((sec) => (
            <li key={sec.id}>
              <a
                href={`#${sec.id}`}
                onClick={() => setActive(sec.id)}
                className={`block hover:text-blue-600 ${
                  active === sec.id ? "text-blue-600 font-semibold" : ""
                }`}
              >
                {sec.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <section className="w-4/5 space-y-15">
        
        <div id="intro" className="scroll-mt-25">
          <h1 className="text-3xl font-bold mb-4">1. About EZBuy</h1>
          <p className="text-lg leading-relaxed">
            EZBuy is a leading mobile phone retailer website in Vietnam, 
            where you can find a full range of phones from popular to high-end models.
            We provide high-quality products from major brands, 
            with diverse designs and the most optimized prices for customers.
            We are committed to providing genuine products, 
            transparent pricing, and dedicated customer care service.
          </p>
        </div>

        <div id="founders" className="scroll-mt-25">
          <h2 className="text-2xl font-semibold mb-4">2. Founding Team</h2>
          <p className="text-lg leading-relaxed mb-2">
            EZBuy was founded by three members with a passion for technology:
          </p>
          <ul className="list-disc list-inside text-lg space-y-1">
            <li>Nguyen Ngoc Long</li>
            <li>Bui Kinh Luan</li>
            <li>Bui Minh Quan</li>
          </ul>
          <p>Driven by an intense passion for technology, the three founders met 
            and resolved to jointly build a strong, reputable, and high-quality technology company.
          </p>
        </div>

        <div id="products" className="scroll-mt-25">
          <h2 className="text-2xl font-semibold mb-4">3. Products & Services</h2>
          <p className="text-lg leading-relaxed mb-2">
            We offer a diverse range of mobile phones from major brands 
            such as iPhone, Samsung, Oppo, Huawei, Xiaomi... 
            In addition, EZBuy continuously updates the latest products 
            to meet the technological needs of our customers.
          </p>
        </div>
        
        <div id="mission" className="scroll-mt-25">
          <h2 className="text-2xl font-semibold mb-4">4. Mission</h2>
          <p className="text-lg leading-relaxed mb-2">
            The EZBuy system aims to bring customers the best shopping experiences 
            by providing genuine products, professional service, and thoughtful after-sales policies. 
            EZBuy constantly innovates and develops, 
            striving to become a leading technology retailer in Vietnam, 
            while delivering practical value to the community.
          </p>
        </div>

        <div id="values" className="scroll-mt-25">
          <h2 className="text-2xl font-semibold mb-4">5. Core Values</h2>
          <div className="text-lg leading-relaxed mb-2">
            <ul className="space-y-3"> 
                <li>
                    <strong>Quality and Trust:</strong> EZBuy is committed to providing genuine, 
                    high-quality products with reliable warranty policies and attentive customer care, 
                    aiming to give customers absolute peace of mind when purchasing technology, 
                    electronics, and home appliances.
                </li>
                <li>
                    <strong>Customer Focus:</strong> Serving customers is always the top priority. 
                    EzPhone constantly focuses on improving service quality, fostering a team of enthusiastic, 
                    honest, and sincere employees, bringing maximum benefits and satisfaction to customers.
                </li>
                <li>
                    <strong>Innovation and Development:</strong> EZBuy always updates and innovates products, 
                    technology, and services to meet the constantly changing needs of the market and customers. 
                </li>
                <li>
                    <strong>Accompanying the Community:</strong> EZBuy not only focuses on business development 
                    but also pays attention to social activities, actively contributing to the development of the community and society.
                </li>
            </ul>
          </div>
        </div>

        <div id="future_direction" className="scroll-mt-25">
          <h2 className="text-2xl font-semibold mb-4">6. Future Direction</h2>
          <p className="text-lg leading-relaxed">
            With the goal of "Creating excellent customer experiences," 
            EZBuy continues to promote digital transformation for application in sales, 
            management, and personnel training... according to a dedicated service strategy to enhance customer experience. 
            We strongly invest in multi-platform online business, exploring and 
            applying technology to understand and approach customers flexibly and effectively, 
            constantly affirming our position as one of the most reputable retail brands in Vietnam.
          </p>
        </div>
      </section>
    </main>
  );
}