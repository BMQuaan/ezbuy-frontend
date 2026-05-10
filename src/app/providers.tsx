"use client";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/redux/store";
import { fetchCartWithTotal } from "@/lib/redux/slices/cartSlice";

import { SnackbarProvider, useSnackbar } from "notistack";
import { bindNotistack } from "@/lib/notification/notistack";

function NotistackBinder() {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    bindNotistack(enqueueSnackbar);
  }, [enqueueSnackbar]);
  return null;
}

export default function AppProviders({ children }: PropsWithChildren) {
  const store = useMemo(() => makeStore(), []);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (token) {
      store.dispatch(fetchCartWithTotal());
    }
  }, [store]);
  return (
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={2500}
        preventDuplicate
      >
        <NotistackBinder />
        {children}
      </SnackbarProvider>
    </Provider>
  );
}
