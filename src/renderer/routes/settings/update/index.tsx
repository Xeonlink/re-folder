import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useVersion } from "@renderer/api/extra";
import {
  useSetUpdateCheckPolicy,
  useSetUpdateDownloadPolicy,
  useSetUpdateInstallPolicy,
  useUpdateCheckPolicy,
  useUpdateDownloadPolicy,
  useUpdateInfo,
  useUpdateInstallPolicy,
} from "@renderer/api/update";
import { api } from "@renderer/api/utils";
import { Dot3 } from "@renderer/components/Dot3";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Textarea } from "@renderer/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { createFileRoute } from "@tanstack/react-router";
import { DownloadIcon, FolderDown, Server, X } from "lucide-react";

export const Route = createFileRoute("/settings/update/")({
  component: Page,
});

function Page() {
  const { toast } = useToastWithDismiss();
  const { data: version } = useVersion();
  const { data: update } = useUpdateInfo();
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

  const updateState2Text = () => {
    switch (update.state) {
      case "idle":
        return "";
      case "checking":
        return "확인 중...";
      case "available":
        return `업데이트 있음. ${version} -> ${update.availableVersion}`;
      case "downloading":
        return `다운로드 중 ${update.downloadPercent}%`;
      case "ready":
        return "설치 준비됨";
      case "error":
        return update.errorMessage ?? "알 수 없는 오류";
      case "not-available":
        return "업데이트 없음";
    }
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
                  >
                    수동
                  </Button>
                </div>
              </li>
            </ul>
          </Card>

          <Textarea
            className="h-80 focus-visible:ring-0 border-none resize-none text-sm"
            value={updateState2Text()}
            readOnly
          />
        </main>
      </ScrollArea>
      <footer>
        <ul className="flex h-12">
          {["idle", "error", "not-available"].includes(update.state) ? (
            <li className="w-full">
              <Button className="size-full rounded-t-none" variant="secondary" onClick={() => api.checkForUpdates()}>
                <Server className="w-4 h-4" /> &nbsp; 업데이트 확인 &nbsp;
                <MagnifyingGlassIcon className="w-4 h-4" />
              </Button>
            </li>
          ) : null}

          {update.state === "checking" ? (
            <li className="w-full">
              <Button className="size-full rounded-none rounded-bl-md" variant="secondary" disabled>
                <MagnifyingGlassIcon className="w-5 h-5" />
                &nbsp;확인 중<Dot3 interval={400} />
              </Button>
            </li>
          ) : null}

          {update.state === "available" ? (
            <li className="w-full">
              <Button className="size-full rounded-t-none" variant="secondary" onClick={() => api.downloadUpdate()}>
                <DownloadIcon className="w-5 h-5" /> &nbsp; 업데이트 다운로드
              </Button>
            </li>
          ) : null}

          {update.state === "downloading" ? (
            <li className="w-full">
              <Button className="size-full rounded-none rounded-bl-md" variant="secondary" disabled>
                <DownloadIcon className="w-5 h-5" />
                &nbsp;다운로드 중<Dot3 interval={400} />
              </Button>
            </li>
          ) : null}
          {["checking", "downloading"].includes(update.state) ? (
            <li className="w-36">
              <Button
                className="size-full rounded-none rounded-br-md"
                variant="secondary"
                onClick={() => api.cancelUpdate()}
              >
                <X className="w-5 h-5" /> &nbsp;취소
              </Button>
            </li>
          ) : null}

          {update.state === "ready" ? (
            <li className="w-full">
              <Button className="size-full rounded-t-none" variant="secondary" onClick={() => api.installUpdate()}>
                <FolderDown className="w-5 h-5" /> &nbsp; 설치 및 재시작
              </Button>
            </li>
          ) : null}
        </ul>
      </footer>
    </>
  );
}
