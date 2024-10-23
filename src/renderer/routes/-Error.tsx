import { UpdateIcon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";
import { Textarea } from "@renderer/components/ui/textarea";
import { ErrorComponentProps, useRouter } from "@tanstack/react-router";

export function Error(props: ErrorComponentProps) {
  const { error, reset, info } = props;
  const { message, name, cause, stack } = error;
  const componentStack = info?.componentStack ?? "";
  const errorString = JSON.stringify({ message, name, cause, stack, componentStack }, null, 2);

  const router = useRouter();

  const onResetClick = () => {
    router.invalidate();
    reset();
  };

  return (
    <main className="w-full px-2 mb-2 mt-1 text-end">
      <Textarea className="w-full" id="message" rows={20} value={errorString} readOnly />
      <Button onClick={onResetClick} variant="outline" size="lg" className="mt-2">
        <UpdateIcon />
        &nbsp;새로고침
      </Button>
    </main>
  );
}
