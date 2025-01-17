import { useCreateFolderPreset, useRootFolderPresets } from "@renderer/api/folderPresets";
import { Dot3 } from "@renderer/components/Dot3";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { on } from "@renderer/lib/utils";
import { Key2FocusIndex } from "@renderer/lib/arrowNavigation";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Pending } from "./-Pending";

export const Route = createFileRoute("/folder-presets/")({
  component: Page,
  pendingComponent: Pending,
});

export function Page() {
  const { toast } = useToastWithDismiss();
  const { data: folderPresets } = useRootFolderPresets();
  const creator = useCreateFolderPreset(null);

  const createFolderPreset = () => {
    creator.mutate({
      onError: (error) => toast(error.name, error.message),
    });
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
                <Button variant="ghost" className="h-16 w-full flex-col items-start" autoFocus={index === 0} asChild>
                  <Link
                    to="/folder-presets/$folderPresetId"
                    params={{ folderPresetId: preset.id }}
                    tabIndex={index + 1}
                    onKeyDown={on(Key2FocusIndex("ArrowUp", index), Key2FocusIndex("ArrowDown", index + 2))}
                  >
                    <span>{preset.name}</span>
                    <span className="text-xs">{preset.description}</span>
                  </Link>
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
