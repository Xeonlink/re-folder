import { ArrowLeftIcon, ArrowRightIcon, Cross1Icon, MinusIcon } from "@radix-ui/react-icons";
import ImgLogo from "@renderer/assets/icon.png";
import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@renderer/components/ui/dialog";
import { Toaster } from "@renderer/components/ui/toaster";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { createRootRoute, Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Error } from "./-Error";

export const Route = createRootRoute({
  component: Page,
  errorComponent: Error
});

function Page() {
  const router = useRouter();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useShortcuts({
    win32: {
      "alt+arrowleft": router.history.back,
      "alt+arrowright": router.history.forward,
      "ctrl+o": () => !open && setOpen(true)
    },
    darwin: {
      "meta+arrowleft": router.history.back,
      "meta+arrowright": router.history.forward,
      "meta+o": () => !open && setOpen(true)
    }
  });

  const onDialogKeyDown =
    (hasPrev: boolean, hasNext: boolean) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (hasNext && e.key === "ArrowDown") {
        const element = e.currentTarget.nextElementSibling as HTMLElement;
        element?.focus();
        return;
      }
      if (hasPrev && e.key === "ArrowUp") {
        const element = e.currentTarget.previousElementSibling as HTMLElement;
        element?.focus();
        return;
      }
    };

  return (
    <>
      <header className="w-full flex sticky top-0 bg-background rounded-b-sm">
        <div className="flex py-2 pl-2">
          <Button
            variant="ghost"
            size="sm_icon"
            onClick={() => router.history.back()}
            tabIndex={-1}
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            variant="ghost"
            size="sm_icon"
            onClick={() => router.history.forward()}
            tabIndex={-1}
          >
            <ArrowRightIcon />
          </Button>
        </div>
        <div className="flex-1 window-handle"></div>

        <Link to="/" className="py-3" onContextMenu={() => setOpen(true)} tabIndex={-1}>
          <img src={ImgLogo} alt="re-folder" className="h-6" />
        </Link>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogTitle>
          <DialogContent className="w-fit p-0 gap-0 bg-transparent border-0" hideDefaultClose>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="lg"
                className="text-lg h-16 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => navigate({ to: "/folder-presets" })}
                onKeyDown={onDialogKeyDown(false, true)}
                autoFocus
              >
                폴더 프리셋
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="lg"
                className="text-lg h-16 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => navigate({ to: "/watchers" })}
                onKeyDown={onDialogKeyDown(true, true)}
              >
                감시자
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="lg"
                className="text-lg h-16 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => navigate({ to: "/settings" })}
                onKeyDown={onDialogKeyDown(true, false)}
              >
                설정
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        <div className="flex-1 window-handle"></div>
        <div className="flex pr-2 py-2">
          <Button
            variant="ghost"
            size="sm_icon"
            onClick={() => window.api.minimizeSelf()}
            tabIndex={-1}
          >
            <MinusIcon className="relative top-1" />
          </Button>
          <Button
            variant="ghost"
            size="sm_icon"
            onClick={() => window.api.closeSelf()}
            tabIndex={-1}
          >
            <Cross1Icon />
          </Button>
        </div>
      </header>
      <Outlet />
      <Toaster />
    </>
  );
}
