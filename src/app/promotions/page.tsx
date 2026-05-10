// app/promotions/page.tsx
import Campaign from "@/components/promotions/Campaign";
import NewDeals from "@/components/promotions/NewDeals";


export default function PromotionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Campaign />
      <NewDeals />
    </div>
  );
}
