import { Pending } from "./-Pending";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useCreateRule, useRules, useUpdateRuleOrder } from "@renderer/api/rules";
import { useCopyWatcher, useDeleteWatcher, useUpdateWatcher, useWatcher } from "@renderer/api/watchers";
import { DraggableItem } from "@renderer/components/DraggableItme";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Skeleton } from "@renderer/components/ui/skeleton";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
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

  const gotoRule = (ruleId: string) => {
    navigate({ to: "/rules/$ruleId", params: { ruleId } });
  };

  const onDeleteClick = () => {
    deleteWatcher.mutate({
      onError: (error) => {
        toast(error.name, error.message);
      },
    });
    router.history.back();
  };
  const enable = (isEnable: boolean) => async (_: React.MouseEvent<HTMLButtonElement>) => {
    if (watcher.enabled !== isEnable) {
      await updateWatcher.mutateAsync({
        data: { enabled: isEnable },
        onError: (error) => {
          const action = isEnable ? "활성화" : "비활성화";
          toast(`${action} 실패`, error.message);
        },
      });
    }
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
    <main className="w-full flex flex-col justify-start items-center mb-2 space-y-2">
      <Card className="w-96 shadow-none">
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
          <li className="flex items-center">
            <Label className="flex-1">활성화</Label>
            <div className="flex w-56">
              <Button
                className="w-full rounded-tr-none rounded-br-none"
                size="sm"
                variant={watcher.enabled ? "default" : "secondary"}
                onClick={enable(true)}
              >
                <Power className="w-5 h-5" />
              </Button>
              <Button
                className="w-full rounded-tl-none rounded-bl-none"
                size="sm"
                variant={watcher.enabled ? "secondary" : "default"}
                onClick={enable(false)}
              >
                <PowerOff className="w-5 h-5" />
              </Button>
            </div>
          </li>
          <li className="flex items-center">
            <Label className="flex-1">복사하기</Label>
            <Button className="w-56" variant="secondary" size="sm" onClick={onCopyClick}>
              <Copy className="w-5 h-5" />
            </Button>
          </li>
          <li className="flex items-center">
            <Label className="flex-1">삭제하기</Label>
            <Button className="w-56" variant="secondary" size="sm" onClick={onDeleteClick}>
              <Trash2Icon className="w-5 h-5" />
            </Button>
          </li>
        </ul>
      </Card>
      {ruleOrder.length > 0 ? (
        <Reorder.Group axis="y" values={ruleOrder} onReorder={setRuleOrder} className="space-y-2">
          {ruleOrder.map((rule) => (
            <DraggableItem key={rule.id} value={rule} onDragEnd={onRuleDragEnd}>
              {(dragCtrl) => (
                <Button
                  className="w-96 justify-start h-12"
                  variant={rule.enabled ? "secondary" : "outline"}
                  onClick={() => gotoRule(rule.id)}
                >
                  <div className="flex-1 text-left overflow-hidden">
                    <span>{rule.name}</span>
                    &nbsp;&nbsp;
                    <span className="text-xs">{rule.path}</span>
                  </div>
                  <DragHandleDots2Icon
                    className="w-6 h-full ml-2"
                    onPointerDown={(e) => dragCtrl.start(e)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Button>
              )}
            </DraggableItem>
          ))}
        </Reorder.Group>
      ) : null}
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
  );
}
