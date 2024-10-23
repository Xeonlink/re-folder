import { ArrowLeftIcon, ArrowRightIcon, Cross1Icon, MinusIcon } from "@radix-ui/react-icons";
import ImgLogo from "@renderer/assets/logo3.png";
import { useTheme } from "@renderer/components/ThemeProvider";
import { Button } from "@renderer/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@renderer/components/ui/context-menu";
import { Toaster } from "@renderer/components/ui/toaster";
import { createRootRoute, Link, Outlet, useRouter } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Page
});

function Page() {
  const router = useRouter();
  const { setTheme } = useTheme();

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
        <ContextMenu>
          <ContextMenuTrigger className="py-3">
            <Link to="/">
              <img src={ImgLogo} alt="re-folder" className="h-6" />
            </Link>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => setTheme("light")}>Light</ContextMenuItem>
            <ContextMenuItem onClick={() => setTheme("dark")}>Dark</ContextMenuItem>
            <ContextMenuItem onClick={() => setTheme("system")}>System</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

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
