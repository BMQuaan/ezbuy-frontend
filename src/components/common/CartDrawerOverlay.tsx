"use client";
import { useAppSelector } from "@/lib/redux/hook";
import { useDispatch } from "react-redux";
import CartDrawer from "../cart/CartDrawer";
import {
  closeCartDrawer,
  selectIsCartDrawerOpen,
} from "@/lib/redux/slices/cartDrawerSlice";
import Portal from "./Portal";

export default function CartDrawerOverlay() {
  const open = useAppSelector(selectIsCartDrawerOpen);
  const dispatch = useDispatch();

  return (
    <Portal>
      <CartDrawer open={open} onClose={() => dispatch(closeCartDrawer())} />
    </Portal>
  );
}
