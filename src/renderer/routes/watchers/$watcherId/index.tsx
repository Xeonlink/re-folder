import { Pending } from "./-Pending";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useCreateRule, useRules, useUpdateRuleOrder } from "@renderer/api/rules";
import { useCopyWatcher, useDeleteWatcher, useUpdateWatcher, useWatcher } from "@renderer/api/watchers";
import { DraggableItem } from "@renderer/components/DraggableItme";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Skeleton } from "@renderer/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { cn } from "@renderer/lib/utils";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { Reorder, motion } from "framer-motion";
import { Copy, PlusIcon, Power, PowerOff, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Rule } from "src/main/schema";

export const Route = createFileRoute("/watchers/$watcherId/")({
  component: Page,
  pendingComponent: Pending,
});

type NormalKey = "name" | "description";

function Page() {
  const { watcherId } = Route.useParams();
  const { data: watcher } = useWatcher(watcherId);
  const { data: rules } = useRules(watcherId);
  const navigate = useNavigate();
  const { toast } = useToastWithDismiss();
  const router = useRouter();

  const copyWatcher = useCopyWatcher(watcherId);
  const deleteWatcher = useDeleteWatcher(watcherId);
  const updateWatcher = useUpdateWatcher(watcherId);
  const createRule = useCreateRule(watcherId);
  const updateRuleOrder = useUpdateRuleOrder(watcherId);
  const [ruleOrder, setRuleOrder] = useState<Rule[]>(rules);
  useEffect(() => setRuleOrder(rules), [rules]);

  const onModifyBlur = (key: NormalKey) => async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === watcher[key]) return;
    await updateWatcher.mutateAsync({
      data: { [key]: value },
      onError: (error) => {
        toast(error.name, error.message);
        e.target.value = watcher[key];
      },
    });
  };

  const onSelectFolderClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    const results = await window.api.selectFolder();
    if (results.canceled) return;
    const target = e.target as HTMLInputElement;
    target.value = results.filePaths[0];
    await updateWatcher.mutateAsync({
      data: { path: results.filePaths[0] },
      onError: (error) => {
        toast(error.name, error.message);
        target.value = watcher.path;
      },
    });
  };

  const onRuleDragEnd = async () => {
    const data = {};
    for (let i = 0; i < ruleOrder.length; i++) {
      if (ruleOrder[i].id === rules[i].id) continue;
      data[ruleOrder[i].id] = i;
    }
    if (Object.keys(data).length === 0) return;

    await updateRuleOrder.mutateAsync({
      data,
      onError: (error) => {
        toast(error.name, error.message);
        setRuleOrder(rules);
      },
    });
  };

  const onDeleteClick = () => {
    deleteWatcher.mutate({
      onError: (error) => {
        toast(error.name, error.message);
      },
    });
    router.history.back();
  };
  const toggle = () => async (_: React.MouseEvent<HTMLButtonElement>) => {
    const isEnable = !watcher.enabled;
    await updateWatcher.mutateAsync({
      data: { enabled: isEnable },
      onError: (error) => {
        const action = isEnable ? "활성화" : "비활성화";
        toast(`${action} 실패`, error.message);
      },
    });
  };
  const onCreateRuleClick = async () => {
    await createRule.mutateAsync({
      onError: (error) => {
        toast(error.name, error.message);
      },
    });
  };
  const onCopyClick = () => {
    copyWatcher.mutate({
      onError: (error) => {
        toast(error.name, error.message);
      },
    });
    router.history.back();
  };

  return (
    <>
      <ScrollArea className="flex-1">
        <main className="p-2 space-y-2">
          <Card className={cn("shadow-none", { "border-primary": watcher.enabled })}>
            <ul className="m-4 space-y-2">
              <li className="flex items-center">
                <Label htmlFor="name" className="flex-1">
                  이름
                </Label>
                <Input
                  id="name"
                  className="bg-secondary border-none w-56"
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
                  className="bg-secondary border-none w-56"
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
                  className="bg-secondary border-none w-56"
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
                  className="w-full justify-between h-12"
                  variant={rule.enabled ? "secondary" : "outline"}
                  onClick={() => navigate({ to: "/rules/$ruleId", params: { ruleId: rule.id } })}
                >
                  <span>
                    {rule.name}&nbsp;&nbsp;<span className="text-xs">{rule.path}</span>
                  </span>
                  <DragHandleDots2Icon className="w-5 h-full" data-drag-handle />
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
              <Skeleton className="w-96 h-12 flex justify-center items-center">
                <PlusIcon className="animate-spin" />
              </Skeleton>
            </motion.div>
          ) : (
            <Button className="w-96 justify-between h-12 border-dashed" variant="outline" onClick={onCreateRuleClick}>
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
                    className="w-full rounded-none rounded-bl-md items-center gap-1 flex-col h-full"
                    variant="secondary"
                    size="default"
                    onClick={toggle()}
                  >
                    {watcher.enabled ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{watcher.enabled ? "비활성화 하기" : "활성화 하기"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="w-full rounded-none gap-1.5 h-full flex-col"
                    variant="secondary"
                    size="default"
                    onClick={onCopyClick}
                  >
                    <Copy className="w-5 h-5" />
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
                    className="w-full rounded-none rounded-br-md gap-1.5 h-full flex-col"
                    variant="secondary"
                    size="default"
                    onClick={onDeleteClick}
                  >
                    <Trash2Icon className="w-5 h-5" />
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
