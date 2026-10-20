import { confirmDialog, notify } from "../services/notify.service";

export function getErrorMessage(error) {
  return (
    error?.mensaje?.mensaje ||
    error?.mensaje ||
    error?.response?.data?.mensaje?.mensaje ||
    error?.response?.data?.mensaje ||
    error?.response?.data?.message ||
    error?.message ||
    "Ocurrió un error inesperado"
  );
}

export async function executeRequest({
  request,
  confirm = null,
  loadingMessage = "Procesando...",
  successMessage = "Operación realizada correctamente",
  errorMessage = "Ocurrió un error",
  onSuccess,
  onError,
}) {
  try {
    if (confirm) {
      const accepted = await confirmDialog(confirm);
      if (!accepted) {
        return { ok: false, cancelled: true };
      }
    }

    const promise = request();
    const data = await notify.promise(promise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    });

    if (onSuccess) {
      await onSuccess(data);
    }

    return { ok: true, data };
  } catch (error) {
    const message = getErrorMessage(error);
    notify.error(message || errorMessage);

    if (onError) {
      onError(error);
    }

    return { ok: false, error };
  }
}