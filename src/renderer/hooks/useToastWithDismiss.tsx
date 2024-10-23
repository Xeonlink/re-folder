import { ToastAction } from "@renderer/components/ui/toast";
import { useToast } from "./use-toast";
import { Cross1Icon } from "@radix-ui/react-icons";

export function useToastWithDismiss() {
  const { toast, dismiss, toasts } = useToast();

  const doToast = (title: string, description: string) => {
    const toastResult = toast({
      title,
      description,
      className: "h-16",
      action: (
        <ToastAction altText="닫기" onClick={() => toastResult.dismiss()}>
          <Cross1Icon />
        </ToastAction>
      )
    });
    return toastResult;
  };

  return { toast: doToast, dismiss, toasts };
}
