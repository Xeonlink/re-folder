import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@renderer/components/ui/toast";
import { useToast } from "@renderer/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            {/* <ToastClose /> */}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
