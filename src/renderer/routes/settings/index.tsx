import { GearIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { useVersion } from "@renderer/api/extra";
import { useTheme } from "@renderer/components/ThemeProvider";
import { WifiSignal } from "@renderer/components/WifiSignal";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Label } from "@renderer/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { URL } from "@renderer/constants";
import { useClipboard } from "@renderer/hooks/useTextClipboard";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Mail, MonitorCog, Moon, Sun } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/settings/")({
  component: Page,
});

function Page() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToastWithDismiss();
  const { copy } = useClipboard();
  const { data: version } = useVersion();
  const [wifiCount, setWifiCount] = useState(0);

  const linkTo = (link: string) => () => {
    window.open(link, "_blank");
  };

  return (
    <main className="w-full flex flex-col justify-start items-center mb-2 space-y-2">
      <Card className="w-96 shadow-none">
        <ul className="m-4 space-y-2">
          <li className="flex items-center">
            <Label htmlFor="version" className="flex-1">
              버전
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="w-56" variant="secondary" size="sm" onClick={() => copy(version)}>
                    {version}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>복사하기</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="flex items-center">
            <Label htmlFor="theme" className="flex-1">
              테마
            </Label>
            <div className="flex w-56">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="w-full rounded-tr-none rounded-br-none"
                      size="sm"
                      variant={theme === "light" ? "default" : "secondary"}
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>라이트</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="w-full rounded-none"
                      size="sm"
                      variant={theme === "dark" ? "default" : "secondary"}
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>다크</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="w-full rounded-tl-none rounded-bl-none"
                      size="sm"
                      variant={theme === "system" ? "default" : "secondary"}
                      onClick={() => setTheme("system")}
                    >
                      <MonitorCog className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>시스템</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </li>
          <li className="flex items-center">
            <Label htmlFor="apikey" className="flex-1">
              Open AI
            </Label>
            <Button variant="secondary" size="sm" className="w-56" asChild>
              <Link to="/settings/openai">
                <GearIcon className="w-5 h-5" />
              </Link>
            </Button>
          </li>
          <li className="flex items-center">
            <Label htmlFor="apikey" className="flex-1">
              업데이트
            </Label>
            <Button variant="secondary" size="sm" className="w-56" asChild>
              <Link to="/settings/update">
                <GearIcon className="w-5 h-5" />
              </Link>
            </Button>
          </li>
        </ul>
      </Card>

      <Card className="w-96 shadow-none border-none">
        <div className="m-4 grid grid-cols-6 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-full font-normal col-span-2"
                  size="sm"
                  variant="secondary"
                  onClick={linkTo(URL.GITHUB)}
                >
                  <GitHubLogoIcon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>링크열기</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-full font-normal col-span-2"
                  size="sm"
                  variant="secondary"
                  onClick={() => setWifiCount((prev) => prev + 1)}
                >
                  <WifiSignal count={wifiCount} className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>준비중</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-full font-normal col-span-2"
                  size="sm"
                  variant="secondary"
                  onClick={linkTo(URL.MAILTO)}
                >
                  <Mail className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>메일보내기</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            className="w-full font-normal col-span-3"
            size="sm"
            variant="secondary"
            onClick={() => {
              // linkTo(URL.LICENSE);
              toast("준비중", "개인정보처리방침을 작성중입니다.");
            }}
          >
            개인정보처리방침
          </Button>
          <Button className="w-full font-normal col-span-3" size="sm" variant="secondary" onClick={linkTo(URL.LICENSE)}>
            소프트웨어 라이센스
          </Button>
        </div>
      </Card>
    </main>
  );
}
