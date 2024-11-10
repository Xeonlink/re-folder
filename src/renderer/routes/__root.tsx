import { ArrowLeftIcon, ArrowRightIcon, Cross1Icon, MinusIcon } from "@radix-ui/react-icons";
import ImgLogo from "@renderer/assets/logo.png";
import { Button } from "@renderer/components/ui/button";
import { Toaster } from "@renderer/components/ui/toaster";
import { createRootRoute, Outlet, useNavigate, useRouter } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Page
});

function Page() {
  const router = useRouter();
  const navigate = useNavigate();

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
        <button
          className="py-3"
          onClick={gotoRoot}
          onContextMenu={() => navigate({ to: "/settings" })}
        >
          <img src={ImgLogo} alt="re-folder" className="h-6" />
        </button>

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
