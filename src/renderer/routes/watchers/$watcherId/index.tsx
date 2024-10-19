import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useCreateRule, useRules, useUpdateRuleOrder } from "@renderer/api/rules";
import { useDeleteWatcher, useUpdateWatcher, useWatcher } from "@renderer/api/watchers";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { DragControls, Reorder, useDragControls } from "framer-motion";
import { useEffect, useState } from "react";
import { Rule } from "src/main/schema";

export const Route = createFileRoute("/watchers/$watcherId/")({
  component: Page
});

function Page() {
  const { watcherId } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();

  const watcher = useWatcher(watcherId);
  const deleteWatcher = useDeleteWatcher(watcherId);
  const updateWatcher = useUpdateWatcher(watcherId);
  const createRule = useCreateRule(watcherId);
  const rules = useRules(watcherId);
  const updateRuleOrder = useUpdateRuleOrder(watcherId);
  const [ruleOrder, setRuleOrder] = useState<Rule[]>([]);

  const onNameChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (name === watcher.data?.name) return;
    updateWatcher.mutate({ name });
  };

  const onSelectFolderClick = async () => {
    const results = await window.dialog.selectFolder();
    if (results.canceled) return;
    updateWatcher.mutate({ path: results.filePaths[0] });
  };

  const gotoRule = (ruleId: string) => {
    navigate({
      to: "/watchers/$watcherId/rules/$ruleId",
      params: { watcherId, ruleId }
    });
  };

  useEffect(() => {
    if (rules.isSuccess) {
      setRuleOrder(rules.data);
    }
  }, [rules.isSuccess]);

  return (
    <main className="w-full h-full flex flex-col justify-start items-center space-y-2">
      <Card className="w-96 shadow-none">
        <ul className="m-4 space-y-2">
          <li className="flex items-center">
            <Label className="flex-1">이름</Label>
            <Input
              className="bg-secondary border-none w-56"
              size="sm"
              defaultValue={watcher.data?.name}
              onBlur={(e) => onNameChange(e)}
            />
          </li>
          <li className="flex items-center">
            <Label className="flex-1">감시경로</Label>
            <Button
              variant="secondary"
              size="sm"
              className="w-56 justify-start"
              onClick={onSelectFolderClick}
            >
              {watcher.data?.path}
            </Button>
          </li>
          <li className="flex items-center">
            <Label className="flex-1">활성화</Label>
            <div className="flex w-56">
              <Button
                className="w-full rounded-tr-none rounded-br-none"
                size="sm"
                variant={watcher.data?.enabled ? "default" : "secondary"}
                onClick={() => {
                  if (!watcher.data?.enabled) {
                    updateWatcher.mutate({ enabled: true });
                  }
                }}
              >
                켜짐
              </Button>
              <Button
                className="w-full rounded-tl-none rounded-bl-none"
                size="sm"
                variant={watcher.data?.enabled ? "secondary" : "default"}
                onClick={() => {
                  if (watcher.data?.enabled) {
                    updateWatcher.mutate({ enabled: false });
                  }
                }}
              >
                꺼짐
              </Button>
            </div>
          </li>
          <li className="flex items-center">
            <Label className="flex-1">삭제하기</Label>
            <Button
              className="w-56"
              variant="secondary"
              size="sm"
              onClick={async () => {
                await deleteWatcher.mutateAsync();
                router.history.back();
              }}
            >
              삭제하기
            </Button>
          </li>
        </ul>
      </Card>
      {rules.isSuccess ? (
        <Reorder.Group axis="y" values={ruleOrder} onReorder={setRuleOrder} className="space-y-2">
          {ruleOrder.map((rule) => (
            <DraggableItem key={rule.id} value={rule}>
              {(dragCtrl) => (
                <Button
                  className="w-96 justify-start h-12"
                  variant={rule.enabled ? "secondary" : "outline"}
                  onClick={() => gotoRule(rule.id)}
                  onDragEnd={() => {
                    const reOrderMap = {};
                    for (let i = 0; i < ruleOrder.length; i++) {
                      if (ruleOrder[i].id !== rules.data[i].id) {
                        reOrderMap[ruleOrder[i].id] = i;
                      }
                    }
                    if (Object.keys(reOrderMap).length) {
                      updateRuleOrder.mutate(reOrderMap);
                    }
                  }}
                >
                  <div className="flex-1 text-left">
                    <span>{rule.name}</span>
                    &nbsp;&nbsp;
                    <span className="text-xs">{rule.description}</span>
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
      <Button
        className="w-96 justify-between h-12 border-dashed"
        variant="outline"
        onClick={() => createRule.mutate()}
      >
        <span>규칙 만들기</span>
      </Button>
    </main>
  );
}

function DraggableItem(props: {
  value: any;
  onDragEnd?: () => void;
  children: (ctrl: DragControls) => React.ReactNode;
}) {
  const { value, onDragEnd, children } = props;
  const dragCtrl = useDragControls();

  return (
    <Reorder.Item
      value={value}
      dragControls={dragCtrl}
      dragListener={false}
      onDragEnd={() => onDragEnd?.()}
    >
      {children(dragCtrl)}
    </Reorder.Item>
  );
}
