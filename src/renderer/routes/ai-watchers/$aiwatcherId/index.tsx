import { Pending } from "./-Pending";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useCreateRule, useRules, useUpdateRuleOrder } from "@renderer/api/rules";
import { api } from "@renderer/api/utils";
import { useCopyWatcher, useDeleteWatcher, useRunWatcher, useUpdateWatcher, useWatcher } from "@renderer/api/watchers";
import { DraggableItem } from "@renderer/components/DraggableItme";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Skeleton } from "@renderer/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { cn } from "@renderer/lib/utils";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { Reorder, motion } from "framer-motion";
import { CircleFadingArrowUp, Copy, Eye, EyeClosed, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Rule } from "src/main/schema";

export const Route = createFileRoute("/ai-watchers/$aiwatcherId/")({
  component: Page,
  pendingComponent: Pending,
});

type NormalKey = "name" | "description";

function Page() {
  const { aiwatcherId: watcherId } = Route.useParams();
  const { data: watcher } = useWatcher(watcherId);
  const { data: rules } = useRules(watcherId);
  const navigate = useNavigate();
  const { toast } = useToastWithDismiss();
  const router = useRouter();

  const copyWatcher = useCopyWatcher(watcherId);
  const deleteWatcher = useDeleteWatcher(watcherId);
  const updateWatcher = useUpdateWatcher(watcherId);
  const runWatcher = useRunWatcher(watcherId);
  const createRule = useCreateRule(watcherId);
  const updateRuleOrder = useUpdateRuleOrder(watcherId);
  const [ruleOrder, setRuleOrder] = useState<Rule[]>(rules);
  useEffect(() => setRuleOrder(rules), [rules]);

  const onModifyBlur = (key: NormalKey) => async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === watcher[key]) return;
    updateWatcher.mutate({
      data: { [key]: value },
      onError: (error) => {
        toast(error.name, error.message);
        e.target.value = watcher[key];
      },
    });
  };

  const onSelectFolderClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    const results = await api.selectFolder();
    if (results.canceled) return;
    const target = e.target as HTMLInputElement;
    target.value = results.filePaths[0];
    updateWatcher.mutate({
      data: { path: results.filePaths[0] },
      onError: (error) => {
        toast(error.name, error.message);
        target.value = watcher.path;
      },
    });
  };

  const onRuleDragEnd = () => {
    const data = {};
    for (let i = 0; i < ruleOrder.length; i++) {
      if (ruleOrder[i].id === rules[i].id) continue;
      data[ruleOrder[i].id] = i;
    }
    if (Object.keys(data).length === 0) return;

    updateRuleOrder.mutate({
      data,
      onError: (error) => {
        toast(error.name, error.message);
        setRuleOrder(rules);
      },
    });
  };

  const onDeleteClick = () => {
    deleteWatcher.mutate({
      onError: (error) => toast(error.name, error.message),
      onSuccess: () => router.history.back(),
    });
  };
  const toggle = () => {
    const isEnable = !watcher.enabled;
    updateWatcher.mutate({
      data: { enabled: isEnable },
      onError: (error) => {
        const action = isEnable ? "활성화" : "비활성화";
        toast(`${action} 실패`, error.message);
      },
    });
  };
  const run = () => {
    runWatcher.mutate({
      onError: (error) => toast(error.name, error.message),
    });
  };
  const onCreateRuleClick = () => {
    createRule.mutate({
      onError: (error) => toast(error.name, error.message),
    });
  };
  const copy = () => {
    copyWatcher.mutate({
      onError: (error) => toast(error.name, error.message),
      onSuccess: () => router.history.back(),
    });
  };

  useShortcuts(
    {
      win32: {
        "ctrl+delete": onDeleteClick,
        "ctrl+d": copy,
        "ctrl+t": toggle,
      },
      darwin: {
        "meta+backspace": onDeleteClick,
        "meta+d": copy,
        "meta+t": toggle,
      },
    },
    [watcher],
  );

  return (
    <>
      <ScrollArea className="flex-1">
        <main className="space-y-2 p-2">
          <Card className={cn("shadow-none", { "border-primary": watcher.enabled })}>
            <ul className="m-4 space-y-2">
              <li className="flex items-center">
                <Label htmlFor="name" className="flex-1">
                  이름
                </Label>
                <Input
                  id="name"
                  className="w-56 border-none bg-secondary"
                  size="sm"
                  name="name"
                  defaultValue={watcher.name}
                  onBlur={onModifyBlur("name")}
                />
              </li>
              <li className="flex items-center">
                <Label htmlFor="description" className="flex-1">
                  설명
                </Label>
                <Input
                  id="description"
                  className="w-56 border-none bg-secondary"
                  size="sm"
                  name="description"
                  defaultValue={watcher.description}
                  onBlur={onModifyBlur("description")}
                />
              </li>
              <li className="flex items-center">
                <Label htmlFor="path" className="flex-1">
                  감시경로
                </Label>
                <Input
                  id="path"
                  name="path"
                  className="w-56 border-none bg-secondary"
                  size="sm"
                  onClick={onSelectFolderClick}
                  defaultValue={watcher.path}
                  readOnly
                />
              </li>
            </ul>
          </Card>
          <Reorder.Group
            axis="y"
            values={ruleOrder}
            onReorder={setRuleOrder}
            className={cn("space-y-2", { contents: ruleOrder.length === 0 })}
          >
            {ruleOrder.map((rule) => (
              <DraggableItem key={rule.id} value={rule} onDragEnd={onRuleDragEnd}>
                <Button
                  className="h-12 w-full justify-between"
                  variant={rule.enabled ? "secondary" : "outline"}
                  onClick={() =>
                    navigate({
                      to: "/rules/$ruleId",
                      params: { ruleId: rule.id },
                    })
                  }
                >
                  <span>
                    {rule.name}&nbsp;&nbsp;
                    <span className="text-xs">{rule.path}</span>
                  </span>
                  <DragHandleDots2Icon className="h-full w-5" data-drag-handle />
                </Button>
              </DraggableItem>
            ))}
          </Reorder.Group>
          {createRule.isPending ? (
            <motion.div
              initial={{ scale: 0.3 }}
              animate={{ scale: 1 }}
              transition={{ ease: "linear", type: "spring", duration: 0.5 }}
            >
              <Skeleton className="flex h-12 w-96 items-center justify-center">
                <PlusIcon className="animate-spin" />
              </Skeleton>
            </motion.div>
          ) : (
            <Button className="h-12 w-96 justify-between border-dashed" variant="outline" onClick={onCreateRuleClick}>
              규칙 만들기
            </Button>
          )}
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
                    {watcher.enabled ? <Eye className="h-5 w-5" /> : <EyeClosed className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{watcher.enabled ? "감시해제" : "감시하기"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-full w-full flex-col items-center gap-1 rounded-none"
                    variant="secondary"
                    onClick={run}
                  >
                    <CircleFadingArrowUp className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>1회 실행</p>
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
                    onClick={onDeleteClick}
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
