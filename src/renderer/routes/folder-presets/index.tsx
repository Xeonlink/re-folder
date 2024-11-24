import { usePlatform } from "@renderer/api/extra";
import {
  useCreateFolderPreset,
  useDeleteFolderPresetById,
  useRootFolderPresets
} from "@renderer/api/folderPresets";
import { Button } from "@renderer/components/ui/button";
import { Skeleton } from "@renderer/components/ui/skeleton";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { eventSplitor } from "@renderer/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { Pending } from "./-Pending";

export const Route = createFileRoute("/folder-presets/")({
  component: Page,
  pendingComponent: Pending
});

export function Page() {
  const navigate = useNavigate();
  const { toast } = useToastWithDismiss();
  const { data: platform } = usePlatform();
  const { data: folderPresets } = useRootFolderPresets();
  const creator = useCreateFolderPreset(null);
  const deletor = useDeleteFolderPresetById();

  const createFolderPreset = async () => {
    await creator.mutateAsync({
      onError: (error) => {
        toast(error.name, error.message);
      }
    });
  };
  const deleteFolderPreset = async (folderPresetId: string) => {
    await deletor.mutateAsync({
      parentId: null,
      id: folderPresetId,
      onError: (error) => {
        toast(error.name, error.message);
      }
    });
  };

  const gotoFolderPreset = (folderPresetId: string) => () => {
    navigate({ to: "/folder-presets/$folderPresetId", params: { folderPresetId } });
  };

  useShortcuts({
    win32: {
      "ctrl+n": createFolderPreset
    },
    darwin: {
      "meta+n": createFolderPreset
    }
  });

  const arrowFocusEventHandler =
    (options: Partial<Record<"enabled" | "hasUp" | "hasRight" | "hasDown" | "hasLeft", boolean>>) =>
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const { enabled = true } = options;
      if (!enabled) return;
      if (options.hasUp && e.key === "ArrowUp") {
        const element = e.currentTarget.previousElementSibling
          ?.previousElementSibling as HTMLElement;
        element?.focus();
        return;
      }
      if (options.hasRight && e.key === "ArrowRight") {
        const element = e.currentTarget.nextElementSibling as HTMLElement;
        element?.focus();
        return;
      }
      if (options.hasDown && e.key === "ArrowDown") {
        const element = e.currentTarget.nextElementSibling?.nextElementSibling as HTMLElement;
        element?.focus();
        return;
      }
      if (options.hasLeft && e.key === "ArrowLeft") {
        const element = e.currentTarget.previousElementSibling as HTMLElement;
        element?.focus();
        return;
      }
    };
  const deleteEventHandler =
    (options: { enabled?: boolean; id: string }) =>
    async (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const { enabled = true, id } = options;
      if (!enabled) return;
      if (platform === "win32" && e.key === "Delete") {
        deleteFolderPreset(id);
        return;
      }
      if (platform === "darwin" && e.key === "Backspace" && e.metaKey) {
        deleteFolderPreset(id);
        return;
      }
    };

  return (
    <main className="w-full grid grid-cols-2 px-2 gap-2 mb-2 mt-1">
      {folderPresets.map((preset, index) => (
        <Button
          variant="outline"
          className="w-full h-28"
          autoFocus={index === 0}
          tabIndex={index + 1}
          key={preset.id}
          onClick={gotoFolderPreset(preset.id)}
          onKeyDown={eventSplitor(
            arrowFocusEventHandler({
              hasUp: index > 1,
              hasRight: index % 2 === 0,
              hasDown: index < folderPresets.length - 1,
              hasLeft: index % 2 === 1
            }),
            deleteEventHandler({
              id: preset.id
            })
          )}
        >
          {preset.name}
        </Button>
      ))}
      {creator.isPending ? ( //
        <motion.div
          initial={{ scale: 0.3 }}
          animate={{ scale: 1 }}
          transition={{ ease: "linear", type: "spring", duration: 0.5 }}
        >
          <Skeleton className="h-28 w-full flex justify-center items-center">
            <PlusIcon className="animate-spin" />
          </Skeleton>
        </motion.div>
      ) : (
        <Button
          variant="outline"
          className="h-28 border-dashed w-full"
          onClick={createFolderPreset}
          tabIndex={folderPresets.length}
          onKeyDown={arrowFocusEventHandler({
            hasUp: folderPresets.length > 1,
            hasLeft: folderPresets.length % 2 === 1
          })}
        >
          <PlusIcon />
        </Button>
      )}
    </main>
  );
}
