"use client"

import React, { useEffect,useState  } from "react"
import {fetchPromotions} from '@/features/promotions/services'
import {Promotion} from '@/features/promotions/types'


export default function PromotionPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const loadData = async () =>{
      try{
        const data = await fetchPromotions();
        console.log("Promption test",data)
        setPromotions(data);
      }catch(error){
        console.error("Lỗi khi tải khuyến mãi:", error);
      }finally{
        setLoading(false)
      }
    };
    loadData();
  },[])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading ...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[var(--color-background)] py-10 px-6">
      <h1 className="text-3xl font-bold text-center text-[var(--color-primary)] mb-10">
        Attractive promotional program
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={`p-6 rounded-2xl border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
              promo.active
                ? "bg-gradient-to-br from-[var(--color-primary-200)] to-[var(--color-card)] border-[var(--color-border)]"
                : "bg-[var(--color-muted)] border-[var(--color-border)] opacity-85"
            }`}
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-center mb-4">
                {(() => {
                  const now = new Date();
                  const start = promo.startDate ? new Date(promo.startDate) : null;
                  const end = promo.endDate ? new Date(promo.endDate) : null;

                  let statusText = "Unknown";
                  let statusColor = "bg-gray-400 text-white";

                  if (start && start > now) {
                    statusText = "Upcoming";
                    statusColor = "bg-primary-400 text-white";
                  } else if (start && end && start <= now && end >= now) {
                    statusText = "Happening";
                    statusColor = "bg-success text-white";
                  } else if (end && end < now) {
                    statusText = "Has ended";
                    statusColor = "bg-red-500 text-white";
                  }

                  return (
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
                      {statusText}
                    </span>
                  );
                })()}
                  {promo.code && (
                    <span className="text-xs bg-[var(--color-warning)] text-white px-3 py-1 rounded-md font-medium">
                      Promo_CODE: {promo.code}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-semibold text-[var(--color-foreground)] mb-2 leading-snug">
                  {promo.description}
                </h2>

                {promo.discountValue > 0 && (
                  <p className="text-lg font-bold text-[var(--color-danger)]">
                    Reduce {promo.discountValue}
                    {promo.discountValue <= 100 ? "%" : "đ"}
                  </p>
                )}
              </div>

              <div className="mt-4 text-sm text-[var(--color-secondary-600)]">
                <p>
                  From{" "}
                  <b>
                    {promo.startDate
                      ? new Date(promo.startDate).toLocaleDateString()
                      : "-"}
                  </b>{" "}
                  To{" "}
                  <b>
                    {promo.endDate
                      ? new Date(promo.endDate).toLocaleDateString()
                      : "-"}
                  </b>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
