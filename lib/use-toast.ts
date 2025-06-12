// lib/use-toast.ts
import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

export function useCustomToast() {
  const showToast = (type: ToastType, message: string, description?: string) => {
    switch (type) {
      case "success":
        toast.success(message, { description });
        break;
      case "error":
        toast.error(message, { description });
        break;
      case "info":
        toast.info(message, { description });
        break;
      case "warning":
        toast.warning(message, { description });
        break;
      default:
        toast(message, { description });
    }
  };

  return { showToast };
}