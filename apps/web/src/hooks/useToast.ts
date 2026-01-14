import { useCallback } from 'react';
import { useSnackbar, type OptionsObject, type SnackbarKey, type VariantType } from 'notistack';

type ToastOptions = Omit<OptionsObject, 'variant'>;

export function useToast() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const show = useCallback(
    (message: string, variant: VariantType, options?: ToastOptions): SnackbarKey => {
      return enqueueSnackbar(message, { variant, ...options });
    },
    [enqueueSnackbar],
  );

  const success = useCallback((message: string, options?: ToastOptions) => show(message, 'success', options), [show]);
  const error = useCallback((message: string, options?: ToastOptions) => show(message, 'error', options), [show]);
  const info = useCallback((message: string, options?: ToastOptions) => show(message, 'info', options), [show]);
  const warning = useCallback((message: string, options?: ToastOptions) => show(message, 'warning', options), [show]);

  return {
    show,
    success,
    error,
    info,
    warning,
    close: closeSnackbar,
  };
}
