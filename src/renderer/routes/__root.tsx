import { ArrowLeftIcon, ArrowRightIcon, Cross1Icon, MinusIcon } from "@radix-ui/react-icons";
import { usePlatform } from "@renderer/api/extra";
import { api } from "@renderer/api/utils";
import ImgLogo from "@renderer/assets/icon.png";
import { Button } from "@renderer/components/ui/button";
import { Toaster } from "@renderer/components/ui/toaster";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { Link, Outlet, createRootRoute, useRouter } from "@tanstack/react-router";
import { Error } from "./-Error";

export const Route = createRootRoute({
  component: Page,
  errorComponent: Error,
});

function Page() {
  const router = useRouter();
  const { data: platform } = usePlatform();

  useShortcuts({
    win32: {
      "alt+arrowleft": router.history.back,
      "alt+arrowright": router.history.forward,
    },
    darwin: {
      "meta+arrowleft": router.history.back,
      "meta+arrowright": router.history.forward,
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

        <Link to="/" className="bg-secondary py-3" tabIndex={-1}>
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
