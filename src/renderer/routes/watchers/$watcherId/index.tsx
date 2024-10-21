import { Cross1Icon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useCreateRule, useUpdateRuleOrder } from "@renderer/api/rules";
import { useDeleteWatcher, useUpdateWatcher } from "@renderer/api/watchers";
import { DraggableItem } from "@renderer/components/DraggableItme";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { ToastAction } from "@renderer/components/ui/toast";
import { useToast } from "@renderer/hooks/use-toast";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { Reorder } from "framer-motion";
import { Power, PowerOff, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/watchers/$watcherId/")({
  component: Page,
  loader: async ({ params }) => ({
    watcher: await window.api.getWatcher(params.watcherId),
    rules: await window.api.getRules(params.watcherId)
  })
});

function Page() {
  const { watcherId } = Route.useParams();
  const { watcher, rules } = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();
  const { toast } = useToast();

  const deleteWatcher = useDeleteWatcher(watcherId);
  const updateWatcher = useUpdateWatcher(watcherId);
  const createRule = useCreateRule(watcherId);
  const updateRuleOrder = useUpdateRuleOrder(watcherId);
  const [ruleOrder, setRuleOrder] = useState(rules);
  const [enabled, setEnabled] = useState(watcher.enabled);

  useEffect(() => {
    setRuleOrder(rules);
  }, [rules]);

  const onNameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      const name = e.target.value;
      if (name === watcher.name) return;
      await updateWatcher.mutateAsync({ name });
    } catch (error: any) {
      const { message } = error;
      e.target.value = watcher.name;
      const toastResult = toast({
        title: "수정 실패",
        description: message,
        className: "h-16",
        action: (
          <ToastAction altText="닫기" onClick={() => toastResult.dismiss()}>
            <Cross1Icon />
          </ToastAction>
        )
      });
    }
  };

  const onSelectFolderClick = async () => {
    try {
      const results = await window.api.selectFolder();
      if (results.canceled) return;
      await updateWatcher.mutateAsync({ path: results.filePaths[0] });
    } catch (error: any) {
      const { message } = error;
      const toastResult = toast({
        title: "폴더 선택 실패",
        description: message,
        className: "h-16",
        action: (
          <ToastAction altText="닫기" onClick={() => toastResult.dismiss()}>
            <Cross1Icon />
          </ToastAction>
        )
      });
    }
  };

  const onRuleDragEnd = async () => {
    try {
      const reOrderMap = {};
      for (let i = 0; i < ruleOrder.length; i++) {
        if (ruleOrder[i].id !== rules[i].id) {
          reOrderMap[ruleOrder[i].id] = i;
        }
      }
      if (Object.keys(reOrderMap).length === 0) {
        return;
      }
      // await Promise.reject(new Error("테스트 에러"));
      await updateRuleOrder.mutateAsync(reOrderMap);
    } catch (error: any) {
      const { message } = error;
      const toastResult = toast({
        title: "순서 변경 실패",
        description: message,
        className: "h-16",
        action: (
          <ToastAction altText="닫기" onClick={() => toastResult.dismiss()}>
            <Cross1Icon />
          </ToastAction>
        )
      });
      setRuleOrder(rules);
    }
  };

  const gotoRule = (ruleId: string) => {
    navigate({ to: "/rules/$ruleId", params: { ruleId } });
  };

  const onDeleteClick = async () => {
    try {
      await deleteWatcher.mutateAsync();
      router.history.back();
    } catch (error: any) {
      const { message } = error;
      const toastResult = toast({
        title: "삭제 실패",
        description: message,
        className: "h-16",
        action: (
          <ToastAction altText="닫기" onClick={() => toastResult.dismiss()}>
            <Cross1Icon />
          </ToastAction>
        )
      });
    }
  };

  const onEnableClick = async () => {
    try {
      if (!enabled) {
        setEnabled(true);
        // await Promise.reject(new Error("테스트 에러"));
        await updateWatcher.mutateAsync({ enabled: true });
      }
    } catch (error: any) {
      const { message } = error;
      const toastResult = toast({
        title: "변경 실패",
        description: message,
        className: "h-16",
        action: (
          <ToastAction altText="닫기" onClick={() => toastResult.dismiss()}>
            <Cross1Icon />
          </ToastAction>
        )
      });
      setEnabled(watcher.enabled);
    }
  };

  const onDisableClick = async () => {
    try {
      if (enabled) {
        setEnabled(false);
        // await Promise.reject(new Error("테스트 에러"));
        await updateWatcher.mutateAsync({ enabled: false });
      }
    } catch (error: any) {
      const { message } = error;
      const toastResult = toast({
        title: "변경 실패",
        description: message,
        className: "h-16",
        action: (
          <ToastAction altText="닫기" onClick={() => toastResult.dismiss()}>
            <Cross1Icon />
          </ToastAction>
        )
      });
      setEnabled(watcher.enabled);
    }
  };

  const onCreateRuleClick = async () => {
    try {
      // await Promise.reject(new Error("테스트 에러"));
      await createRule.mutateAsync();
    } catch (error: any) {
      const { message } = error;
      const toastResult = toast({
        title: "생성 실패",
        description: message,
        className: "h-16",
        action: (
          <ToastAction altText="닫기" onClick={() => toastResult.dismiss()}>
            <Cross1Icon />
          </ToastAction>
        )
      });
    }
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
              onBlur={onNameBlur}
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
              {watcher.path}
            </Button>
          </li>
          <li className="flex items-center">
            <Label className="flex-1">활성화</Label>
            <div className="flex w-56">
              <Button
                className="w-full rounded-tr-none rounded-br-none"
                size="sm"
                variant={enabled ? "default" : "secondary"}
                onClick={onEnableClick}
              >
                <Power className="w-5 h-5" />
              </Button>
              <Button
                className="w-full rounded-tl-none rounded-bl-none"
                size="sm"
                variant={enabled ? "secondary" : "default"}
                onClick={onDisableClick}
              >
                <PowerOff className="w-5 h-5" />
              </Button>
            </div>
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
                  <div className="flex-1 text-left">
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
      <Button
        className="w-96 justify-between h-12 border-dashed"
        variant="outline"
        onClick={onCreateRuleClick}
      >
        <span>규칙 만들기</span>
      </Button>
    </main>
  );
}
