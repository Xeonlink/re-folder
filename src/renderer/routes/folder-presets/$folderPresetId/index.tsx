import { FolderUnit } from "./-FolderUnit";
import { Pending } from "./-Pending";
import {
  useApplyFolderPreset,
  useCopyFolderPreset,
  useDeleteFolderPreset,
  useFolderPreset,
  useUpdateFolderPreset,
} from "@renderer/api/folderPresets";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { keyboardMoveToTabIndex } from "@renderer/lib/arrowNavigation";
import { on } from "@renderer/lib/utils";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowRight, Copy, Trash2Icon } from "lucide-react";

export const Route = createFileRoute("/folder-presets/$folderPresetId/")({
  component: Page,
  pendingComponent: Pending,
});

type NormalKey = "name" | "description";

function Page() {
  const { folderPresetId } = Route.useParams();

  const router = useRouter();
  const { toast } = useToastWithDismiss();
  const { data: folderPreset } = useFolderPreset(folderPresetId);
  const copyFolderPreset = useCopyFolderPreset(folderPreset.parentId, folderPresetId);
  const deleteFolderPreset = useDeleteFolderPreset(null, folderPresetId);
  const updateFolderPreset = useUpdateFolderPreset(folderPresetId);
  const applyFolderPreset = useApplyFolderPreset(folderPresetId);

  const onModifyBlur = (key: NormalKey) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === folderPreset[key]) return;
    updateFolderPreset.mutate({
      data: { [key]: value },
      onError: (error) => {
        toast(error.name, error.message);
        e.target.value = folderPreset[key];
      },
    });
  };

  const apply = () => {
    applyFolderPreset.mutate({
      onError: (error) => toast(error.name, error.message),
      onSuccess: () => toast("적용 완료", "폴더 프리셋이 적용되었습니다."),
    });
  };
  const deleteOne = () => {
    deleteFolderPreset.mutate({
      onError: (error) => toast(error.name, error.message),
      onSuccess: () => router.history.back(),
    });
  };
  const copy = () => {
    copyFolderPreset.mutate({
      onError: (error) => toast(error.name, error.message),
      onSuccess: () => router.history.back(),
    });
  };

  useShortcuts(
    {
      win32: {
        "ctrl+delete": deleteOne,
        "ctrl+d": copy,
        "ctrl+enter": apply,
      },
      darwin: {
        "meta+backspace": deleteOne,
        "meta+d": copy,
        "meta+enter": apply,
      },
    },
    [folderPreset],
  );

  return (
    <>
      <ScrollArea className="flex-1">
        <main className="mb-2 flex-1 space-y-2 overflow-y-scroll">
          <Card className="mx-2 mt-2 shadow-none">
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
                  defaultValue={folderPreset.name}
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
                  defaultValue={folderPreset.description}
                  onBlur={onModifyBlur("description")}
                />
              </li>
            </ul>
          </Card>
          <div className="w-full overflow-x-scroll">
            <FolderUnit folderPresetId={folderPresetId} depts={1} />
          </div>
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
                    onClick={apply}
                    tabIndex={1}
                    onKeyDown={on(keyboardMoveToTabIndex("ArrowRight", 2))}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>적용하기</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-full w-full flex-col gap-1.5 rounded-none"
                    variant="secondary"
                    onClick={copy}
                    tabIndex={2}
                    onKeyDown={on(keyboardMoveToTabIndex("ArrowLeft", 1), keyboardMoveToTabIndex("ArrowRight", 3))}
                  >
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
                    onClick={deleteOne}
                    tabIndex={3}
                    onKeyDown={on(keyboardMoveToTabIndex("ArrowLeft", 2))}
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
