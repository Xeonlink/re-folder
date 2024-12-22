import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useSetUpdateCheckPolicy, useUpdateCheckPolicy } from "@renderer/api/extra";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, Download, FolderDown, Server } from "lucide-react";

export const Route = createFileRoute("/settings/update/")({
  component: Page,
});

function Page() {
  const { toast } = useToastWithDismiss();
  const { data: updateCheckPolicy } = useUpdateCheckPolicy();
  const policyChanger = useSetUpdateCheckPolicy();

  const changePolicy = (policy: "auto" | "manual") => () => {
    policyChanger.mutate({
      policy,
      onError: (error) => toast(error.name, error.message),
    });
  };

  return (
    <ScrollArea className="flex-1">
      <main className="p-2 space-y-2">
        <h1 className="text-center">아직 제작 중입니다.</h1>
        <Card className="shadow-none">
          <ul className="m-4 space-y-2">
            <li className="flex items-center">
              <Label htmlFor="check-update" className="flex-1">
                확인 정책
              </Label>
              <div className="flex w-56">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="w-full rounded-tr-none rounded-br-none"
                        size="sm"
                        variant={updateCheckPolicy === "auto" ? "default" : "secondary"}
                        onClick={changePolicy("auto")}
                        disabled
                      >
                        자동
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>다운로드가 완료된 이후, 프로그램을 완전히 종료하면 설치</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  className="w-full rounded-l-none"
                  size="sm"
                  variant={updateCheckPolicy === "manual" ? "default" : "secondary"}
                  onClick={changePolicy("manual")}
                  disabled
                >
                  수동
                </Button>
              </div>
            </li>
            <li className="flex items-center">
              <Label htmlFor="check-update" className="flex-1">
                확인
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="w-56" variant="secondary" size="sm" id="check-update" disabled={true}>
                      <>
                        <Server className="w-5 h-5" /> &nbsp;
                        <MagnifyingGlassIcon className="w-5 h-5" />
                      </>
                      {/* 확인 중<Dot3 interval={400} /> */}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {/* <p>업데이트 확인하기</p> */}
                    <p>업데이트 다시 확인하기</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          </ul>
        </Card>

        <div className="text-center">
          <ArrowDown className="w-5 h-5 inline-block" />
        </div>

        <Card className="shadow-none">
          <ul className="m-4 space-y-2">
            <li className="flex items-center">
              <Label htmlFor="check-update" className="flex-1">
                다운로드 정책
              </Label>
              <div className="flex w-56">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="w-full rounded-tr-none rounded-br-none"
                        size="sm"
                        variant={updateCheckPolicy === "auto" ? "default" : "secondary"}
                        onClick={changePolicy("auto")}
                        disabled
                      >
                        자동
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>다운로드가 완료된 이후, 프로그램을 완전히 종료하면 설치</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  className="w-full rounded-l-none"
                  size="sm"
                  variant={updateCheckPolicy === "manual" ? "default" : "secondary"}
                  onClick={changePolicy("manual")}
                  disabled
                >
                  수동
                </Button>
              </div>
            </li>
            <li className="flex items-center">
              <Label htmlFor="check-update" className="flex-1">
                다운로드
              </Label>
              <Button className="w-56" variant="secondary" size="sm" id="check-update" disabled>
                <Download className="w-5 h-5" />
              </Button>
            </li>
          </ul>
        </Card>

        <div className="text-center">
          <ArrowDown className="w-5 h-5 inline-block" />
        </div>

        <Card className="shadow-none">
          <ul className="m-4 space-y-2">
            <li className="flex items-center">
              <Label htmlFor="check-update" className="flex-1">
                설치 정책
              </Label>
              <div className="flex w-56">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="w-full rounded-tr-none rounded-br-none"
                        size="sm"
                        variant={updateCheckPolicy === "auto" ? "default" : "secondary"}
                        onClick={changePolicy("auto")}
                        disabled
                      >
                        자동
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>다운로드가 완료된 이후, 프로그램을 완전히 종료하면 설치</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  className="w-full rounded-l-none"
                  size="sm"
                  variant={updateCheckPolicy === "manual" ? "default" : "secondary"}
                  onClick={changePolicy("manual")}
                  disabled
                >
                  수동
                </Button>
              </div>
            </li>

            <li className="flex items-center">
              <Label htmlFor="check-update" className="flex-1">
                설치
              </Label>
              <Button className="w-56" variant="secondary" size="sm" id="check-update" disabled>
                <FolderDown className="w-5 h-5" />
              </Button>
            </li>
          </ul>
        </Card>
      </main>
    </ScrollArea>
  );
}
