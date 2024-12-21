import { Error } from "./-Error";
import { ArrowLeftIcon, ArrowRightIcon, Cross1Icon, MinusIcon } from "@radix-ui/react-icons";
import ImgLogo from "@renderer/assets/icon.png";
import { Button } from "@renderer/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@renderer/components/ui/dialog";
import { Toaster } from "@renderer/components/ui/toaster";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { Link, Outlet, createRootRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createRootRoute({
  component: Page,
  errorComponent: Error,
});

function Page() {
  const router = useRouter();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useShortcuts({
    win32: {
      "alt+arrowleft": router.history.back,
      "alt+arrowright": router.history.forward,
      "ctrl+o": () => !open && setOpen(true),
    },
    darwin: {
      "meta+arrowleft": router.history.back,
      "meta+arrowright": router.history.forward,
      "meta+o": () => !open && setOpen(true),
    },
  });

  const onDialogKeyDown = (hasPrev: boolean, hasNext: boolean) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
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
      <header className="w-full flex sticky top-0 h-12">
        <div className="flex">
          <Button
            variant="secondary"
            className="p-0 w-10 pl-2 h-full rounded-none"
            onClick={() => router.history.back()}
            tabIndex={-1}
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            className="p-0 w-10 h-full rounded-none pr-2"
            onClick={() => router.history.forward()}
            tabIndex={-1}
          >
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 window-handle bg-secondary"></div>

        <Link to="/" className="py-3 bg-secondary" onContextMenu={() => setOpen(true)} tabIndex={-1}>
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

        <div className="flex-1 window-handle bg-secondary"></div>
        <div className="flex">
          <Button
            variant="secondary"
            className="h-full rounded-none w-10 p-0"
            onClick={() => window.api.minimizeSelf()}
            tabIndex={-1}
          >
            <MinusIcon className="relative top-1 w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            className="h-full rounded-none w-10 p-0 pr-2"
            onClick={() => window.api.closeSelf()}
            tabIndex={-1}
          >
            <Cross1Icon className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <Outlet />
      <Toaster />
    </>
  );
}
