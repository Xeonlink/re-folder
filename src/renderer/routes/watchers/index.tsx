import { Pending } from "./-Pending";
import { useCreateWatcher, useWatchers } from "@renderer/api/watchers";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Skeleton } from "@renderer/components/ui/skeleton";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import React from "react";

export const Route = createFileRoute("/watchers/")({
  component: Page,
  pendingComponent: Pending,
});

function Page() {
  const navigate = useNavigate();
  const { toast } = useToastWithDismiss();
  const { data: watchers } = useWatchers();
  const creator = useCreateWatcher();

  const createWatcher = () => {
    creator.mutate({
      onError: (error) => toast(error.name, error.message),
    });
  };

  const gotoWatcher = (watcherId: string) => () => {
    navigate({ to: "/watchers/$watcherId", params: { watcherId } });
  };

  useShortcuts({
    win32: {
      "ctrl+n": createWatcher,
    },
    darwin: {
      "meta+n": createWatcher,
    },
  });

  const arrowFocusEventHandler =
    (options: Partial<Record<"enabled" | "hasUp" | "hasRight" | "hasDown" | "hasLeft", boolean>>) =>
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const { enabled = true } = options;
      if (!enabled) return;
      if (options.hasUp && e.key === "ArrowUp") {
        const element = e.currentTarget.previousElementSibling?.previousElementSibling as HTMLElement;
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

  return (
    <ScrollArea className="flex-1">
      <main className="grid grid-cols-2 p-2 gap-2">
        {watchers.map((watcher, index) => (
          <Button
            variant="outline"
            className="w-full h-28"
            autoFocus={index === 0}
            tabIndex={index + 1}
            key={watcher.id}
            onClick={gotoWatcher(watcher.id)}
            onKeyDown={arrowFocusEventHandler({
              hasUp: index > 1,
              hasRight: index % 2 === 0,
              hasDown: index < watchers.length - 1,
              hasLeft: index % 2 === 1,
            })}
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
              hasLeft: watchers.length % 2 === 1,
            })}
          >
            <PlusIcon />
          </Button>
        )}
      </main>
    </ScrollArea>
  );
}
