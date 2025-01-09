import { useCreateFolderPreset, useRootFolderPresets } from "@renderer/api/folderPresets";
import { Dot3 } from "@renderer/components/Dot3";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { on } from "@renderer/lib/utils";
import { keyboardMoveFocus } from "@renderer/lib/arrowNavigation";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Pending } from "./-Pending";

export const Route = createFileRoute("/folder-presets/")({
  component: Page,
  pendingComponent: Pending,
});

export function Page() {
  const navigate = useNavigate();
  const { toast } = useToastWithDismiss();
  const { data: folderPresets } = useRootFolderPresets();
  const creator = useCreateFolderPreset(null);

  const createFolderPreset = () => {
    creator.mutate({
      onError: (error) => toast(error.name, error.message),
    });
  };

  const gotoFolderPreset = (folderPresetId: string) => () => {
    navigate({ to: "/folder-presets/$folderPresetId", params: { folderPresetId } });
  };

  useShortcuts({
    win32: {
      "ctrl+n": createFolderPreset,
    },
    darwin: {
      "meta+n": createFolderPreset,
    },
  });

  return (
    <>
      <ScrollArea className="flex-1">
        <main className="p-2">
          <ol className="contents">
            {folderPresets.map((preset, index) => (
              <li className="contents" key={preset.id}>
                <Button
                  variant="ghost"
                  className="h-16 w-full flex-col items-start"
                  autoFocus={index === 0}
                  tabIndex={index + 1}
                  onClick={gotoFolderPreset(preset.id)}
                  onKeyDown={on(
                    keyboardMoveFocus("ArrowUp", ["parent", "prev", "child"]),
                    keyboardMoveFocus("ArrowDown", ["parent", "next", "child"]),
                  )}
                >
                  <span>{preset.name}</span>
                  <span className="text-xs">{preset.description}</span>
                </Button>
              </li>
            ))}
          </ol>
        </main>
      </ScrollArea>
      <footer>
        <ul className="flex h-12">
          <li className="w-full">
            <Button
              variant="secondary"
              className="h-full w-full rounded-t-none"
              onClick={createFolderPreset}
              disabled={creator.isPending}
            >
              {creator.isPending ? (
                <>
                  <PlusIcon className="h-5 w-5 animate-spin" />
                  &nbsp;프리셋&nbsp;생성 중<Dot3 />
                </>
              ) : (
                <>
                  <PlusIcon className="h-5 w-5" />
                  &nbsp;프리셋&nbsp;만들기
                </>
              )}
            </Button>
          </li>
        </ul>
      </footer>
    </>
  );
}
