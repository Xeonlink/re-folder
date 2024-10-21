import { ArrowLeftIcon, Cross1Icon } from "@radix-ui/react-icons";
import ImgLogo from "@renderer/assets/logo.png";
import { ModeChanger } from "@renderer/components/ModeChanger";
import { Button } from "@renderer/components/ui/button";
import { Toaster } from "@renderer/components/ui/toaster";
import { createRootRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { MinusIcon } from "lucide-react";

export const Route = createRootRoute({
  component: Page
});

function Page() {
  const router = useRouter();

  return (
    <>
      <header className="w-full flex sticky top-0 bg-background rounded-b-sm">
        <div className="flex py-2 pl-2">
          <Button variant="ghost" size="sm_icon" onClick={() => router.history.back()}>
            <ArrowLeftIcon />
          </Button>
          <ModeChanger />
        </div>
        <div className="flex-1 window-handle"></div>
        <Link to="/" className="py-3">
          <img src={ImgLogo} alt="re-folder" className="w-6 h-6" />
        </Link>
        <div className="flex-1 window-handle"></div>
        <div className="flex pr-2 py-2">
          <Button variant="ghost" size="sm_icon" onClick={() => window.api.closeSelf()}>
            <MinusIcon className="w-4 h-4 relative top-1" />
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
