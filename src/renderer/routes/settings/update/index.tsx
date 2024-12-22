import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  useSetUpdateCheckPolicy,
  useSetUpdateDownloadPolicy,
  useSetUpdateInstallPolicy,
  useUpdateCheckPolicy,
  useUpdateDownloadPolicy,
  useUpdateInstallPolicy,
} from "@renderer/api/update";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Textarea } from "@renderer/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { createFileRoute } from "@tanstack/react-router";
import { Server } from "lucide-react";

export const Route = createFileRoute("/settings/update/")({
  component: Page,
});

function Page() {
  const { toast } = useToastWithDismiss();
  const { data: updateCheckPolicy } = useUpdateCheckPolicy();
  const checkPolicyChanger = useSetUpdateCheckPolicy();
  const { data: updateDownloadPolicy } = useUpdateDownloadPolicy();
  const downloadPolicyChanger = useSetUpdateDownloadPolicy();
  const { data: updateInstallPolicy } = useUpdateInstallPolicy();
  const installPolicyChanger = useSetUpdateInstallPolicy();

  const changeCheckPolicy = (policy: "auto" | "manual") => () => {
    checkPolicyChanger.mutate({
      policy,
      onError: (error) => toast(error.name, error.message),
    });
  };
  const changeDownloadPolicy = (policy: "auto" | "manual") => () => {
    downloadPolicyChanger.mutate({
      policy,
      onError: (error) => toast(error.name, error.message),
    });
  };
  const changeInstallPolicy = (policy: "auto" | "manual") => () => {
    installPolicyChanger.mutate({
      policy,
      onError: (error) => toast(error.name, error.message),
    });
  };

  return (
    <>
      <ScrollArea className="flex-1">
        <main className="p-2 space-y-2">
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
                          onClick={changeCheckPolicy("auto")}
                          disabled
                        >
                          자동
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>창을 열면, 업데이트 확인</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    className="w-full rounded-l-none"
                    size="sm"
                    variant={updateCheckPolicy === "manual" ? "default" : "secondary"}
                    onClick={changeCheckPolicy("manual")}
                    disabled
                  >
                    수동
                  </Button>
                </div>
              </li>
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
                          variant={updateDownloadPolicy === "auto" ? "default" : "secondary"}
                          onClick={changeDownloadPolicy("auto")}
                          disabled
                        >
                          자동
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>업데이트가 있으면, 자동 다운로드</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    className="w-full rounded-l-none"
                    size="sm"
                    variant={updateDownloadPolicy === "manual" ? "default" : "secondary"}
                    onClick={changeDownloadPolicy("manual")}
                    disabled
                  >
                    수동
                  </Button>
                </div>
              </li>
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
                          variant={updateInstallPolicy === "auto" ? "default" : "secondary"}
                          onClick={changeInstallPolicy("auto")}
                          disabled
                        >
                          자동
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>다운로드가 완료되면, 즉시 설치</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    className="w-full rounded-l-none"
                    size="sm"
                    variant={updateInstallPolicy === "manual" ? "default" : "secondary"}
                    onClick={changeInstallPolicy("manual")}
                    disabled
                  >
                    수동
                  </Button>
                </div>
              </li>
            </ul>
          </Card>

          <Textarea className="h-80 focus-visible:ring-0 border-none resize-none text-xs" defaultValue={""} readOnly />
        </main>
      </ScrollArea>
      <footer>
        <ul className="flex h-12">
          <li className="w-full">
            <Button className="w-full h-full rounded-t-none" variant="secondary" disabled>
              <>
                <Server className="w-4 h-4" /> &nbsp; 업데이트 확인 &nbsp;
                <MagnifyingGlassIcon className="w-4 h-4" />
              </>
              {/* 확인 중<Dot3 interval={400} /> */}
            </Button>
          </li>
        </ul>
      </footer>
    </>
  );
}
