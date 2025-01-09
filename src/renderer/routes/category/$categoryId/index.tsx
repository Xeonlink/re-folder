import { useCopyRule, useDeleteRule, useRule, useUpdateRule } from "@renderer/api/rules";
import { api } from "@renderer/api/utils";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Textarea } from "@renderer/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { cn } from "@renderer/lib/utils";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Copy, Power, PowerOff, Trash2Icon } from "lucide-react";
import { Pending } from "./-Pending";

export const Route = createFileRoute("/category/$categoryId/")({
  component: Page,
  pendingComponent: Pending,
});

type NormalKey = "name" | "description";

const 프롬프트설명 = `
AI에게 이 카테고리에 대해 설명해주세요.
자세히 설명할 수록 AI가 더 잘 분류합니다.
아래의 예시는 한글 작성되었지만, 더 정확한 분류를 위해 영어로 작성하는 것을 권장합니다.

ex)
1. "이 카테고리는 사진들을 저장하는 곳입니다."
2. "빨간색이 많이 들어간 사진이나 이미지를 저장합니다."
3. "다른 어느 카테고리에도 속하지 않는 경우 이 카테고리에 저장합니다."

3줄요약
1. ai가 참고할 카테고리 설명을 적으세요.
2. 자세하게 적으세요.
3. 영어로 적으세요.`;

function Page() {
  const { categoryId } = Route.useParams();
  const { data: rule } = useRule(categoryId);
  const router = useRouter();
  const { toast } = useToastWithDismiss();

  const copior = useCopyRule(rule.watcherId, categoryId);
  const updator = useUpdateRule(categoryId);
  const deletor = useDeleteRule(rule.watcherId, categoryId);

  const onModifyBlur = (key: NormalKey) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value === rule[key]) return;
    updator.mutate({
      data: { [key]: value },
      onError: (error) => {
        toast(`${key} 변경 실패`, error.message);
        e.target.value = rule[key];
      },
    });
  };

  const onSelectFolderClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    const results = await api.selectFolder();
    if (results.canceled) return;
    const target = e.target as HTMLInputElement;
    target.value = results.filePaths[0];
    updator.mutate({
      data: { path: results.filePaths[0] },
      onError: (error) => {
        toast(error.name, error.message);
        target.value = rule.path;
      },
    });
  };

  const toggle = () => {
    const isEnable = !rule.enabled;
    updator.mutate({
      data: { enabled: isEnable },
      onError: (error) => {
        const action = isEnable ? "활성화" : "비활성화";
        toast(`${action} 실패`, error.message);
      },
    });
  };

  const copy = () => {
    copior.mutate({
      onError: (error) => toast("복사 실패", error.message),
      onSuccess: () => router.history.back(),
    });
  };
  const deleteThis = () => {
    deletor.mutate({
      onError: (error) => toast("삭제 실패", error.message),
      onSuccess: () => router.history.back(),
    });
  };

  useShortcuts(
    {
      win32: {
        "ctrl+delete": deleteThis,
        "ctrl+d": copy,
        "ctrl+t": toggle,
      },
      darwin: {
        "meta+backspace": deleteThis,
        "meta+d": copy,
        "meta+t": toggle,
      },
    },
    [rule],
  );

  return (
    <>
      <ScrollArea className="flex-1">
        <main className="flex h-full flex-col space-y-2 p-2">
          <Card className={cn("shadow-none", { "border-primary": rule.enabled })}>
            <ul className="m-4 space-y-2">
              <li className="flex items-center">
                <Label className="flex-1">이름</Label>
                <Input
                  className="w-56 border-none bg-secondary"
                  size="sm"
                  defaultValue={rule.name}
                  onBlur={onModifyBlur("name")}
                />
              </li>
              <li className="flex items-center">
                <Label className="flex-1">출력경로</Label>
                <Input
                  className="w-56 border-none bg-secondary"
                  size="sm"
                  onClick={onSelectFolderClick}
                  defaultValue={rule.path}
                  readOnly
                />
              </li>
            </ul>
          </Card>

          <Textarea
            className="flex-1 resize-none"
            defaultValue={rule.description}
            onBlur={onModifyBlur("description")}
            placeholder={프롬프트설명}
          />
        </main>
      </ScrollArea>
      <footer>
        <ul className="flex h-12">
          <li className="w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-full w-full flex-col items-center gap-1 rounded-none rounded-bl-md"
                    variant="secondary"
                    onClick={toggle}
                  >
                    {rule.enabled ? <PowerOff className="h-5 w-5" /> : <Power className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{rule.enabled ? "비활성화 하기" : "활성화 하기"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="h-full w-full flex-col gap-1.5 rounded-none" variant="secondary" onClick={copy}>
                    <Copy className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>복사하기</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-full w-full flex-col gap-1.5 rounded-none rounded-br-md"
                    variant="secondary"
                    onClick={deleteThis}
                  >
                    <Trash2Icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>즉시 삭제하기</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </footer>
    </>
  );
}
