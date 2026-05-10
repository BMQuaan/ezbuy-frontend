import { createSlice } from "@reduxjs/toolkit";

interface UiCartDrawerState {
  isCartDrawerOpen: boolean;
}

const initialState: UiCartDrawerState = {
  isCartDrawerOpen: false,
};

const uiCartDrawerSlice = createSlice({
  name: "cartDrawer",
  initialState,
  reducers: {
    openCartDrawer: (state) => { state.isCartDrawerOpen = true; },
    closeCartDrawer: (state) => { state.isCartDrawerOpen = false; },
  },
});

export const { openCartDrawer, closeCartDrawer } = uiCartDrawerSlice.actions;

// ✅ selector trả về boolean, không phải cả object
export type RootLike = { cartDrawer: UiCartDrawerState };
export const selectIsCartDrawerOpen = (state: RootLike) => state.cartDrawer.isCartDrawerOpen;

export default uiCartDrawerSlice.reducer;
