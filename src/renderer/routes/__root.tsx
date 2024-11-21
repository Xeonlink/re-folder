import { ArrowLeftIcon, ArrowRightIcon, Cross1Icon, MinusIcon } from "@radix-ui/react-icons";
import ImgLogo from "@renderer/assets/logo.png";
import { Button } from "@renderer/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@renderer/components/ui/dialog";
import { Toaster } from "@renderer/components/ui/toaster";
import { createRootRoute, Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createRootRoute({
  component: Page
});

function Page() {
  const router = useRouter();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const gotoRoot = () => {
    router.history.destroy();
    navigate({ to: "/" });
  };

  return (
    <>
      <header className="w-full flex sticky top-0 bg-background rounded-b-sm">
        <div className="flex py-2 pl-2">
          <Button variant="ghost" size="sm_icon" onClick={() => router.history.back()}>
            <ArrowLeftIcon />
          </Button>
          <Button variant="ghost" size="sm_icon" onClick={() => router.history.forward()}>
            <ArrowRightIcon />
          </Button>
        </div>
        <div className="flex-1 window-handle"></div>

        <button className="py-3" onClick={gotoRoot} onContextMenu={() => setOpen(true)}>
          <img src={ImgLogo} alt="re-folder" className="h-6" />
        </button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="w-fit p-0 gap-0 bg-transparent border-0" hideDefaultClose>
            <DialogClose asChild>
              <Button variant="ghost" size="lg" autoFocus={false} className="text-lg h-16" asChild>
                <Link to="/watchers" onClick={() => router.history.destroy()}>
                  폴더 프리셋
                </Link>
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="ghost" size="lg" autoFocus={false} className="text-lg h-16" asChild>
                <Link to="/watchers" onClick={() => router.history.destroy()}>
                  감시자
                </Link>
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="ghost" size="lg" autoFocus={false} className="text-lg h-16" asChild>
                <Link to="/settings" onClick={() => router.history.destroy()}>
                  설정
                </Link>
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        <div className="flex-1 window-handle"></div>
        <div className="flex pr-2 py-2">
          <Button variant="ghost" size="sm_icon" onClick={() => window.api.minimizeSelf()}>
            <MinusIcon className="relative top-1" />
          </Button>
          <Button variant="ghost" size="sm_icon" onClick={() => window.api.closeSelf()}>
            <Cross1Icon />
          </Button>
        </div>
      </header>
      <Outlet />
      <Toaster />
    </>
  );
}
