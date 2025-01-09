import { GearIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { useVersion } from "@renderer/api/extra";
import { useTheme } from "@renderer/components/ThemeProvider";
import { WifiButton } from "@renderer/components/WifiButton";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { URL } from "@renderer/constants";
import { useClipboard } from "@renderer/hooks/useTextClipboard";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { Key2FocusIndex } from "@renderer/lib/arrowNavigation";
import { on } from "@renderer/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Mail, MonitorCog, Moon, Sun } from "lucide-react";

export const Route = createFileRoute("/settings/")({
  component: Page,
});

function Page() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToastWithDismiss();
  const { copy } = useClipboard();
  const { data: version } = useVersion();

  const linkTo = (link: string) => () => {
    window.open(link, "_blank");
  };

  return (
    <ScrollArea className="flex-1">
      <main className="space-y-2 p-2">
        <Card className="shadow-none">
          <ul className="m-4 space-y-2">
            <li className="flex items-center">
              <Label htmlFor="version" className="flex-1">
                버전
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="w-56"
                      variant="secondary"
                      size="sm"
                      onClick={() => copy(version)}
                      onKeyDown={on(Key2FocusIndex("ArrowDown", 2))}
                      tabIndex={1}
                    >
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
                        className="w-full rounded-br-none rounded-tr-none"
                        size="sm"
                        variant={theme === "light" ? "default" : "secondary"}
                        onClick={() => setTheme("light")}
                        onKeyDown={on(
                          Key2FocusIndex("ArrowUp", 1),
                          Key2FocusIndex("ArrowRight", 3),
                          Key2FocusIndex("ArrowDown", 5),
                        )}
                        tabIndex={2}
                      >
                        <Sun className="h-5 w-5" />
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
                        onKeyDown={on(
                          Key2FocusIndex("ArrowUp", 1),
                          Key2FocusIndex("ArrowLeft", 2),
                          Key2FocusIndex("ArrowRight", 4),
                          Key2FocusIndex("ArrowDown", 5),
                        )}
                        tabIndex={3}
                      >
                        <Moon className="h-5 w-5" />
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
                        className="w-full rounded-bl-none rounded-tl-none"
                        size="sm"
                        variant={theme === "system" ? "default" : "secondary"}
                        onClick={() => setTheme("system")}
                        onKeyDown={on(
                          Key2FocusIndex("ArrowUp", 1),
                          Key2FocusIndex("ArrowLeft", 3),
                          Key2FocusIndex("ArrowDown", 5),
                        )}
                        tabIndex={4}
                      >
                        <MonitorCog className="h-5 w-5" />
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
              <Button
                variant="secondary"
                size="sm"
                className="w-56"
                asChild
                tabIndex={5}
                onKeyDown={on(Key2FocusIndex("ArrowUp", 4), Key2FocusIndex("ArrowDown", 6))}
              >
                <Link to="/settings/openai">
                  <GearIcon className="h-5 w-5" />
                </Link>
              </Button>
            </li>
            <li className="flex items-center">
              <Label htmlFor="apikey" className="flex-1">
                업데이트
              </Label>
              <Button
                variant="secondary"
                size="sm"
                className="w-56"
                asChild
                tabIndex={6}
                onKeyDown={on(Key2FocusIndex("ArrowUp", 5), Key2FocusIndex("ArrowDown", 7))}
              >
                <Link to="/settings/update">
                  <GearIcon className="h-5 w-5" />
                </Link>
              </Button>
            </li>
          </ul>
        </Card>

        <Card className="border-none shadow-none">
          <div className="m-4 grid grid-cols-6 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="col-span-2 w-full font-normal"
                    size="sm"
                    variant="secondary"
                    onClick={linkTo(URL.GITHUB)}
                    tabIndex={7}
                    onKeyDown={on(
                      Key2FocusIndex("ArrowUp", 6),
                      Key2FocusIndex("ArrowRight", 8),
                      Key2FocusIndex("ArrowDown", 10),
                    )}
                  >
                    <GitHubLogoIcon className="h-5 w-5" />
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
                  <WifiButton
                    tabIndex={8}
                    onKeyDown={on(
                      Key2FocusIndex("ArrowUp", 6),
                      Key2FocusIndex("ArrowLeft", 7),
                      Key2FocusIndex("ArrowRight", 9),
                      Key2FocusIndex("ArrowDown", 10),
                    )}
                  />
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
                    className="col-span-2 w-full font-normal"
                    size="sm"
                    variant="secondary"
                    onClick={linkTo(URL.MAILTO)}
                    tabIndex={9}
                    onKeyDown={on(
                      Key2FocusIndex("ArrowUp", 6),
                      Key2FocusIndex("ArrowLeft", 8),
                      Key2FocusIndex("ArrowDown", 11),
                    )}
                  >
                    <Mail className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>메일보내기</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              className="col-span-3 w-full font-normal"
              size="sm"
              variant="secondary"
              onClick={() => {
                toast("준비중", "개인정보처리방침을 작성중입니다.");
              }}
              tabIndex={10}
              onKeyDown={on(Key2FocusIndex("ArrowUp", 8), Key2FocusIndex("ArrowRight", 11))}
            >
              개인정보처리방침
            </Button>
            <Button
              className="col-span-3 w-full font-normal"
              size="sm"
              variant="secondary"
              onClick={linkTo(URL.LICENSE)}
              tabIndex={11}
              onKeyDown={on(Key2FocusIndex("ArrowUp", 8), Key2FocusIndex("ArrowLeft", 10))}
            >
              소프트웨어 라이센스
            </Button>
          </div>
        </Card>
      </main>
    </ScrollArea>
  );
}
