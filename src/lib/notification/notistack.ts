// lib/notistack.ts
import type { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";

let _enqueue:
  | ((msg: SnackbarMessage, options?: OptionsObject) => SnackbarKey)
  | null = null;

export const bindNotistack = (
  fn: (msg: SnackbarMessage, options?: OptionsObject) => SnackbarKey
) => {
  _enqueue = fn;
};

export const notify = (msg: SnackbarMessage, options?: OptionsObject) => {
  if (_enqueue) return _enqueue(msg, options);
  if (typeof window !== "undefined") {
    // gọi trước khi Provider mount → log nhẹ để khỏi "mất" message
    console.warn("Snackbar not ready yet:", msg);
  }
};
