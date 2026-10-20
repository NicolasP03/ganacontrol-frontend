import toast from "react-hot-toast";
import Swal from "sweetalert2";

const swalBase = Swal.mixin({
  confirmButtonColor: "#2563eb",
  cancelButtonColor: "#d33",
  reverseButtons: true,
  customClass: {
    popup: "rounded-2xl",
    confirmButton: "swal-confirm-btn",
    cancelButton: "swal-cancel-btn",
  },
});

export const notify = {
  success: (message) => toast.success(message || "Operación exitosa"),
  error: (message) => toast.error(message || "Ocurrió un error"),
  info: (message) => toast(message || "Información"),
  loading: (message) => toast.loading(message || "Procesando..."),
  dismiss: (id) => toast.dismiss(id),

  promise: (promise, messages = {}) =>
    toast.promise(promise, {
      loading: messages.loading || "Procesando...",
      success: messages.success || "Proceso completado",
      error: messages.error || "Ocurrió un error",
    }),
};

export const confirmDialog = async ({
  title = "¿Estás seguro?",
  text = "Esta acción no se puede deshacer.",
  confirmText = "Sí, continuar",
  cancelText = "Cancelar",
  icon = "warning",
} = {}) => {
  const result = await swalBase.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

  return result.isConfirmed;
};