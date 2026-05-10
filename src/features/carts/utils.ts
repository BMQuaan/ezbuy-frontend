import { AxiosError } from "axios";

export const isStockError = (err: unknown): boolean => {
  const axiosErr = err as AxiosError<{ message?: string }>;
  const status = axiosErr.response?.status;
  const msg = axiosErr.response?.data?.message || axiosErr.message || "";

  return status === 400 && /not enough products in stock/i.test(String(msg));
};
