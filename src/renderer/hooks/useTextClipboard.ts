import { useToastWithDismiss } from "./useToastWithDismiss";

export function useClipboard() {
  const toast = useToastWithDismiss();

  const copy = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      toast.toast("성공", "복사되었습니다.");
    } catch (error) {
      toast.toast("실패", "복사에 실패했습니다.");
    }
  };

  return {
    copy
  };
}
