import { ArrowLeftIcon, ArrowRightIcon, Cross1Icon, MinusIcon } from "@radix-ui/react-icons";
import { usePlatform } from "@renderer/api/extra";
import { api } from "@renderer/api/utils";
import ImgLogo from "@renderer/assets/icon.png";
import { Button, ButtonProps } from "@renderer/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@renderer/components/ui/dialog";
import { Toaster } from "@renderer/components/ui/toaster";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { cn, eventSplitor, onArrowKeyDown } from "@renderer/lib/utils";
import { Link, Outlet, createRootRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Error } from "./-Error";

export const Route = createRootRoute({
  component: Page,
  errorComponent: Error,
});

function Page() {
  const router = useRouter();
  const navigate = useNavigate();
  const { data: platform } = usePlatform();
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

  return (
    <>
      <header className="sticky top-0 flex h-12 w-full">
        {platform === "darwin" ? ( //
          <div className="w-20 bg-secondary" />
        ) : (
          <NavigateBar />
        )}
        <div className="window-handle flex-1 bg-secondary"></div>

        <Link to="/" className="bg-secondary py-3" onContextMenu={() => setOpen(true)} tabIndex={-1}>
          <img src={ImgLogo} alt="re-folder" className="h-6" />
        </Link>

        <div className="window-handle flex-1 bg-secondary"></div>
        {platform === "darwin" ? (
          <NavigateBar />
        ) : (
          <div className="flex">
            <Button
              variant="secondary"
              className="h-full w-10 rounded-none p-0"
              onClick={() => api.minimizeSelf()}
              tabIndex={-1}
            >
              <MinusIcon className="relative top-1 h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              className="h-full w-10 rounded-none p-0 pr-2"
              onClick={() => api.closeSelf()}
              tabIndex={-1}
            >
              <Cross1Icon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </header>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogTitle>
        <DialogContent className="w-fit gap-0 border-0 bg-transparent p-0" hideDefaultClose>
          <DialogClose asChild>
            <RouteMenuButton onClick={() => navigate({ to: "/folder-presets" })} autoFocus>
              폴더 프리셋
            </RouteMenuButton>
          </DialogClose>
          <DialogClose asChild>
            <RouteMenuButton onClick={() => navigate({ to: "/watchers" })}>감시자</RouteMenuButton>
          </DialogClose>
          <DialogClose asChild>
            <RouteMenuButton onClick={() => navigate({ to: "/ai-watchers" })}>AI 감시자</RouteMenuButton>
          </DialogClose>
          <DialogClose asChild>
            <RouteMenuButton onClick={() => navigate({ to: "/settings" })}>설정</RouteMenuButton>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Outlet />
      <Toaster />
    </>
  );
}

function NavigateBar() {
  const router = useRouter();

  return (
    <div className="flex">
      <Button
        variant="secondary"
        className="h-full w-10 rounded-none p-0 pl-2"
        onClick={() => router.history.back()}
        tabIndex={-1}
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        className="h-full w-10 rounded-none p-0 pr-2"
        onClick={() => router.history.forward()}
        tabIndex={-1}
      >
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

function RouteMenuButton(props: ButtonProps) {
  const { variant, size, className, onKeyDown, children, ...other } = props;
  return (
    <Button
      variant="ghost"
      size="lg"
      className={cn("h-16 text-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}
      onKeyDown={eventSplitor(onKeyDown, onArrowKeyDown)}
      {...other}
    >
      {props.children}
    </Button>
  );
}
