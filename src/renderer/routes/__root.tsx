import { usePlatform } from "@/renderer/api/extra";
import { api } from "@/renderer/api/utils";
import ImgLogo from "@/renderer/assets/icon.png";
import { Button } from "@/renderer/components/ui/button";
import { Toaster } from "@/renderer/components/ui/toaster";
import { useShortcuts } from "@/renderer/hooks/useShortcuts";
import { cn } from "@/renderer/lib/utils";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Cross1Icon,
  MinusIcon,
} from "@radix-ui/react-icons";
import {
  Link,
  Outlet,
  createRootRoute,
  useRouter,
} from "@tanstack/react-router";
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
      <header
        className={cn("sticky top-0 flex h-12 w-full", {
          "flex-row-reverse": platform === "darwin",
        })}
      >
        <div className="flex">
          <Button
            className="h-full w-10 rounded-none p-0 pl-2"
            variant="secondary"
            onClick={() => router.history.back()}
            tabIndex={-1}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            className="h-full w-10 rounded-none p-0 pr-2"
            variant="secondary"
            onClick={() => router.history.forward()}
            tabIndex={-1}
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="window-handle bg-secondary flex-1"></div>

        <Link className="bg-secondary py-3" to="/" tabIndex={-1}>
          <img className="h-6" src={ImgLogo} alt="re-folder" />
        </Link>

        <div className="window-handle bg-secondary flex-1"></div>

        {platform === "darwin" ? (
          <div className="bg-secondary w-20" />
        ) : (
          <div className="flex">
            <Button
              className="h-full w-10 rounded-none p-0"
              variant="secondary"
              onClick={() => api.minimizeSelf()}
              tabIndex={-1}
            >
              <MinusIcon className="relative top-1 h-4 w-4" />
            </Button>
            <Button
              className="h-full w-10 rounded-none p-0 pr-2"
              variant="secondary"
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
