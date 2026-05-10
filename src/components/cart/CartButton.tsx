"use client";

import Link from "next/link";
import { BsHandbag } from "react-icons/bs";
import { useAppSelector } from "@/lib/redux/hook";
import { selectCount } from "@/lib/redux/slices/cartSlice";


// tải chậm Drawer để giảm bundle cho navbar
// const CartDrawer = dynamic(() => import("./CartDrawer"), { ssr: false });

export default function CartButton() {
  const count = useAppSelector(selectCount);
  // const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Link
        href="/cart"
        className="relative flex space-x-1 md:space-x-3 items-center text-primary hover:text-primary-700 font-[550] text-[15px] lg:text-[18px]"
        aria-label="Cart"
        // onClick={() => setIsOpen(true)}
        // type="button"
      >
        <BsHandbag className="w-5 h-5 md:w-6 md:h-6" />
        <span className="hidden md:flex">Cart</span>

        {count > 0 && (
          <span
            aria-label={`${count} items in cart`}
            className="absolute -top-3 -right-2 min-w-5 md:min-w-6 h-5 px-1 rounded-full
                       bg-danger
                       text-primary-foreground text-[11px] md:text-xs
                       flex items-center justify-center"
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Link>

      {/* Drawer */}
      {/* <CartDrawer open={isOpen} onClose={() => setIsOpen(false)} /> */}
    </>
  );
}
