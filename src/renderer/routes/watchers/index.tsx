import { useCreateWatcher, useDeleteWatcherById, useWatchers } from "@renderer/api/watchers";
import { Button } from "@renderer/components/ui/button";
import { Skeleton } from "@renderer/components/ui/skeleton";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { eventSplitor } from "@renderer/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { Pending } from "./-Pending";
import React from "react";
import { usePlatform } from "@renderer/api/extra";

export const Route = createFileRoute("/watchers/")({
  component: Page,
  pendingComponent: Pending
});

function Page() {
  const navigate = useNavigate();
  const { toast } = useToastWithDismiss();
  const { data: platform } = usePlatform();
  const { data: watchers } = useWatchers();
  const creator = useCreateWatcher();
  const deletor = useDeleteWatcherById();

  const createWatcher = async () => {
    await creator.mutateAsync({
      onError: (error) => {
        toast(error.name, error.message);
      }
    });
  };
  const deleteWatcher = async (watcherId: string) => {
    await deletor.mutateAsync({
      id: watcherId,
      onError: (error) => {
        toast(error.name, error.message);
      }
    });
  };

  const gotoWatcher = (watcherId: string) => () => {
    navigate({ to: "/watchers/$watcherId", params: { watcherId } });
  };

  useShortcuts({
    win32: {
      "ctrl+n": createWatcher
    },
    darwin: {
      "meta+n": createWatcher
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
        deleteWatcher(id);
        return;
      }
      if (platform === "darwin" && e.key === "Backspace" && e.metaKey) {
        deleteWatcher(id);
        return;
      }
    };

  return (
    <main className="w-full grid grid-cols-2 px-2 gap-2 mb-2 mt-1">
      {watchers.map((watcher, index) => (
        <Button
          variant="outline"
          className="w-full h-28"
          autoFocus={index === 0}
          tabIndex={index + 1}
          key={watcher.id}
          onClick={gotoWatcher(watcher.id)}
          onKeyDown={eventSplitor(
            arrowFocusEventHandler({
              hasUp: index > 1,
              hasRight: index % 2 === 0,
              hasDown: index < watchers.length - 1,
              hasLeft: index % 2 === 1
            }),
            deleteEventHandler({
              id: watcher.id
            })
          )}
        >
          {watcher.name}
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
          onClick={createWatcher}
          tabIndex={watchers.length}
          onKeyDown={arrowFocusEventHandler({
            hasUp: watchers.length > 1,
            hasLeft: watchers.length % 2 === 1
          })}
        >
          <PlusIcon />
        </Button>
      )}
    </main>
  );
}
