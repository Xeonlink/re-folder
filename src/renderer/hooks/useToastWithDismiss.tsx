import { ToastAction } from "@renderer/components/ui/toast";
import { useToast } from "./use-toast";
import { Cross1Icon } from "@radix-ui/react-icons";

export function useToastWithDismiss() {
  const { toast, dismiss, toasts } = useToast();

  const doToast = (title: string, description: string, dismissDelay: number = 1000 * 2) => {
    const toastResult = toast({
      title,
      description,
      className: "h-16",
      action: (
        <ToastAction
          altText="닫기"
          onClick={() => {
            toastResult.dismiss();
            clearTimeout(timer);
          }}
        >
          <Cross1Icon />
        </ToastAction>
      )
    });
    const timer = setTimeout(() => {
      dismiss(toastResult.id);
    }, dismissDelay);
    return toastResult;
  };

  return { toast: doToast, dismiss, toasts };
}
