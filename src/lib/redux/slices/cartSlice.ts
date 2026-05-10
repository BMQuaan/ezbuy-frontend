// features/carts/cartSlice.ts
import { isStockError } from "@/features/carts/utils";
import { notify } from "@/lib/notification/notistack";
import { AxiosError } from "axios";

import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { ProductClient } from "@/features/products/types";
import { Cart } from "@/features/carts/types";
import api from "@/lib/api/api";

/* ===================== Types & State ===================== */
export type CartState = {
  items: Record<string, Cart>; // key = productId (stringified)
  totalCartPrice: number;
};

const initialState: CartState = {
  items: {},
  totalCartPrice: 0,
};

type CartPayload = {
  items: Cart[];
  totalCartPrice: number;
};

/* ===================== Thunk: fetch cart ===================== */
export const fetchCartWithTotal = createAsyncThunk<CartPayload>(
  "cart/fetchCartWithTotal",
  async () => {
    const res = await api.get("/api/cart");
    return {
      items: (res.data?.data?.items ?? []) as Cart[],
      totalCartPrice: Number(res.data?.data?.totalCartPrice ?? 0),
    };
  }
);

/* ===================== Server Thunks (POST/PUT) ===================== */

// 1) Thêm sản phẩm (hoặc cộng dồn) theo payload Product & qty
export const addToCartServer = createAsyncThunk<
  void,
  { product: ProductClient; qty?: number },
  { state: RootLike }
>(
  "cart/addToCartServer",
  async ({ product, qty = 1 }, { dispatch, getState }) => {
    dispatch(addItem({ ...product, qty }));

    try {
      await api.post("/api/cart", { productId: product.id, quantity: qty });
    } catch (e) {
      await dispatch(fetchCartWithTotal());
      throw e;
    }
  }
);

// 2) Tăng số lượng (theo step) cho productId
export const increaseQuantityServer = createAsyncThunk<
  void,
  { productId: number | string; step?: number },
  { state: RootLike }
>(
  "cart/increaseQuantityServer",
  async ({ productId, step = 1 }, { dispatch, getState }) => {
    dispatch(increaseQuantity({ productId, step }));

    try {
      await api.post("/api/cart", {
        productId: Number(productId),
        quantity: step,
      });
    } catch (e) {
      dispatch(reduceQuantity({ productId, step }));
      if (isStockError(e)) {
        const err = e as Error & { __stock__?: boolean };
        err.__stock__ = true;
        notify("Not enough stock.", {
          variant: "warning",
        });
        throw err;
      }
      throw e;
    }
  }
);

// 3) Giảm số lượng (theo step)
export const reduceQuantityServer = createAsyncThunk<
  void,
  { productId: number | string; step?: number },
  { state: RootLike }
>(
  "cart/reduceQuantityServer",
  async ({ productId, step = 1 }, { dispatch, getState }) => {
    const key = String(productId);
    const curr = getState().cart.items[key]?.quantity ?? 0;

    if (curr <= 1) {
      notify("Quantity must be at least 1", { variant: "warning" });
      return;
    }

    const nextQty = Math.max(1, curr - step); // ✅ min = 1

    dispatch(setQuantity({ productId, qty: nextQty }));

    try {
      await api.put("/api/cart", {
        productId: Number(productId),
        quantity: nextQty,
      });
    } catch (e) {
      dispatch(setQuantity({ productId, qty: curr }));

      const ax = e as AxiosError<{ message?: string }>;
      const msg =
        ax.response?.data?.message || ax.message || "Reduce quantity failed";
      notify(msg, { variant: "error" });
      throw e;
    }
  }
);

// 4) Đặt số lượng tuyệt đối (PUT) — chuẩn nhất cho "sửa số lượng"
export const setQuantityServer = createAsyncThunk<
  void,
  { productId: number | string; qty: number }
>("cart/setQuantityServer", async ({ productId, qty }, { dispatch }) => {
  dispatch(setQuantity({ productId, qty }));

  try {
    await api.put("/api/cart", { productId: Number(productId), quantity: qty });
  } catch (e) {
    await dispatch(fetchCartWithTotal());
    throw e;
  }
});

// 5) Xoá item khỏi giỏ (nếu backend không có DELETE, gửi qty=0)
export const removeItemServer = createAsyncThunk<
  void,
  { productId: number | string }
>("cart/removeItemServer", async ({ productId }, { dispatch }) => {
  // Optimistic: đặt về 0 để reducer xóa
  dispatch(setQuantity({ productId, qty: 0 }));

  try {
    await api.delete(`/api/cart/${productId}`);
  } catch (e) {
    await dispatch(fetchCartWithTotal());
    throw e;
  }
});

export const clearCartServer = createAsyncThunk<void>(
  "cart/clearCartServer",
  async (_, { dispatch }) => {
    dispatch(clearCart());

    try {
      await api.delete("/api/cart/clear");
    } catch (e) {
      throw e;
    }
  }
);

/* ===================== Helpers ===================== */
const recalcTotal = (items: Record<string, Cart>) =>
  Object.values(items).reduce((sum, it) => {
    const line = Number(it.price) * Number(it.quantity);
    return sum + (Number.isFinite(line) ? line : 0);
  }, 0);

/* ===================== Slice ===================== */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ProductClient & { qty?: number }>) => {
      const { id, name, imageUrl, price, qty = 1 } = action.payload;
      const key = String(id);
      const existing = state.items[key];
      const nextQty = (existing?.quantity ?? 0) + qty;

      state.items[key] = {
        cartId: existing?.cartId ?? 0,
        productId: Number(id),
        productName: name,
        productImageUrl: imageUrl ?? "",
        price: Number(price) || 0,
        quantity: nextQty,
        totalPrice: (Number(price) || 0) * nextQty,
      };

      state.totalCartPrice = recalcTotal(state.items);
    },

    increaseQuantity: (
      state,
      action: PayloadAction<{ productId: string | number; step?: number }>
    ) => {
      const key = String(action.payload.productId);
      const step = action.payload.step ?? 1;

      const item = state.items[key];
      if (!item) return;

      item.quantity += step;
      if (item.quantity <= 0) delete state.items[key];
      else item.totalPrice = Number(item.price) * item.quantity;

      state.totalCartPrice = recalcTotal(state.items);
    },

    reduceQuantity: (
      state,
      action: PayloadAction<{ productId: string | number; step?: number }>
    ) => {
      const key = String(action.payload.productId);
      const step = action.payload.step ?? 1;

      const item = state.items[key];
      if (!item) return;

      item.quantity -= step;
      if (item.quantity <= 0) delete state.items[key];
      else item.totalPrice = Number(item.price) * item.quantity;

      state.totalCartPrice = recalcTotal(state.items);
    },

    setQuantity: (
      state,
      action: PayloadAction<{ productId: string | number; qty: number }>
    ) => {
      const key = String(action.payload.productId);
      const { qty } = action.payload;

      const item = state.items[key];
      if (!item) return;

      if (qty <= 0) delete state.items[key];
      else {
        item.quantity = qty;
        item.totalPrice = Number(item.price) * qty;
      }

      state.totalCartPrice = recalcTotal(state.items);
    },

    clearCart: (state) => {
      state.items = {};
      state.totalCartPrice = 0;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchCartWithTotal.fulfilled, (state, { payload }) => {
      const map: Record<string, Cart> = {};
      for (const row of payload.items) {
        map[String(row.productId)] = {
          ...row,
          totalPrice:
            Number(row.totalPrice ?? 0) ||
            (Number(row.price) || 0) * Number(row.quantity || 0),
        };
      }
      state.items = map;
      state.totalCartPrice = Number(payload.totalCartPrice) || recalcTotal(map);
    });
  },
});

export const {
  addItem,
  increaseQuantity,
  reduceQuantity,
  setQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

/* ===================== Selectors ===================== */
export type RootLike = { cart: CartState };

const selectCartState = (root: RootLike) => root.cart;

export const selectItemsMap = createSelector(selectCartState, (c) => c.items);

export const selectItemsArray = createSelector(selectItemsMap, (m) =>
  Object.values(m)
);

export const selectCount = createSelector(selectItemsArray, (arr) =>
  arr.reduce((n, it) => n + (it.quantity || 0), 0)
);

export const selectTotalPrice = createSelector(
  selectCartState,
  (c) => c.totalCartPrice
);
