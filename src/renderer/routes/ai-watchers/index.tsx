import { Pending } from "./-Pending";
import { useCreateWatcher, useWatchers } from "@renderer/api/watchers";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Skeleton } from "@renderer/components/ui/skeleton";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { on } from "@renderer/lib/utils";
import { keyboardMoveToTabIndex } from "@renderer/lib/arrowNavigation";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/ai-watchers/")({
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

  const gotoAIWatcher = (aiwatcherId: string) => () => {
    navigate({ to: "/ai-watchers/$aiwatcherId", params: { aiwatcherId } });
  };

  useShortcuts({
    win32: {
      "ctrl+n": createWatcher,
    },
    darwin: {
      "meta+n": createWatcher,
    },
  });

  return (
    <ScrollArea className="flex-1">
      <main className="p-2">
        <ol className="contents">
          {watchers.map((watcher, index) => (
            <li className="contents" key={watcher.id}>
              <Button
                variant="outline"
                className="h-28 w-full"
                autoFocus={index === 0}
                tabIndex={index + 1}
                onClick={gotoAIWatcher(watcher.id)}
                onKeyDown={on(keyboardMoveToTabIndex("ArrowUp", index), keyboardMoveToTabIndex("ArrowDown", index + 2))}
              >
                {watcher.name}
              </Button>
            </li>
          ))}
        </ol>
        {creator.isPending ? (
          <motion.div
            initial={{ scale: 0.3 }}
            animate={{ scale: 1 }}
            transition={{ ease: "linear", type: "spring", duration: 0.5 }}
          >
            <Skeleton className="flex h-28 w-full items-center justify-center">
              <PlusIcon className="animate-spin" />
            </Skeleton>
          </motion.div>
        ) : (
          <Button
            variant="outline"
            className="h-28 w-full border-dashed"
            onClick={createWatcher}
            tabIndex={watchers.length}
            onKeyDown={on(
              keyboardMoveToTabIndex("ArrowUp", watchers.length),
              keyboardMoveToTabIndex("ArrowDown", watchers.length + 1),
            )}
          >
            <PlusIcon />
          </Button>
        )}
      </main>
    </ScrollArea>
  );
}
