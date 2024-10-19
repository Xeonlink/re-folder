import { ArrowLeftIcon, GearIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import ImgLogo from "@renderer/assets/logo.png";
import { ModeChanger } from "@renderer/components/ModeChanger";
import { Button } from "@renderer/components/ui/button";
import { Link, Outlet, createRootRoute, useRouter } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Page
});

function Page() {
  const router = useRouter();

  return (
    <>
      <header className="w-full p-2 flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => router.history.back()}>
            <ArrowLeftIcon />
          </Button>

          <Button variant="secondary" size="icon">
            <GitHubLogoIcon />
          </Button>
        </div>
        <div className="flex gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <img src={ImgLogo} alt="re-folder" className="w-8 h-8" />
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-40">
              re-folder
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <ModeChanger />
          <Button variant="outline" className="relative" size="icon">
            <GearIcon className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </Button>
        </div>
      </header>
      <Outlet />
    </>
  );
}
