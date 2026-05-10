"use client";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import cartDrawerReducer from "./slices/cartDrawerSlice";

export const makeStore = () =>
  configureStore({
    reducer: { cart: cartReducer, cartDrawer: cartDrawerReducer },
  });
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// "use client";

// import { configureStore } from "@reduxjs/toolkit";
// import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import authReducer from "./slices/authSlice";

// /* ======== persist config cho auth ======== */
// const authPersistConfig = {
//   key: "auth",
//   storage,
//   whitelist: ["accessToken", "user", "isAuthenticated"], // chỉ lưu các trường này
// };

// /* ======== tạo store ======== */
// const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// export const makeStore = () => {
//   const store = configureStore({
//     reducer: {
//       auth: persistedAuthReducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware({
//         serializableCheck: false, // cần thiết để redux-persist không báo lỗi
//       }),
//   });

//   const persistor = persistStore(store);
//   return { store, persistor };
// };

// /* ======== types ======== */
// export type AppStore = ReturnType<typeof makeStore>;
// export type RootState = ReturnType<AppStore["store"]["getState"]>;
// export type AppDispatch = AppStore["store"]["dispatch"];
