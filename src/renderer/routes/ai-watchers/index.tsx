import { useCreateWatcher, useWatchers } from "@renderer/api/watchers";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { Key2FocusIndex } from "@renderer/lib/arrowNavigation";
import { on } from "@renderer/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Pending } from "./-Pending";

export const Route = createFileRoute("/ai-watchers/")({
  component: Page,
  pendingComponent: Pending,
});

function Page() {
  const { toast } = useToastWithDismiss();
  const { data: watchers } = useWatchers();
  const creator = useCreateWatcher();

  const createWatcher = () => {
    creator.mutate({
      onError: (error) => toast(error.name, error.message),
    });
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
    <>
      <ScrollArea className="flex-1">
        <main className="p-2">
          <ol className="contents">
            {watchers.map((watcher, index) => (
              <li className="contents" key={watcher.id}>
                <Button variant="outline" className="h-28 w-full" autoFocus={index === 0} asChild>
                  <Link
                    to="/ai-watchers/$aiwatcherId"
                    params={{ aiwatcherId: watcher.id }}
                    tabIndex={index + 1}
                    onKeyDown={on(Key2FocusIndex("ArrowUp", index), Key2FocusIndex("ArrowDown", index + 2))}
                  >
                    {watcher.name}
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
            {creator.isPending ? (
              <Button variant="secondary" className="h-full w-full rounded-t-none" disabled>
                <PlusIcon className="h-5 w-5 animate-spin" />
                &nbsp;감시자&nbsp;생성 중...
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="h-full w-full rounded-t-none"
                onClick={createWatcher}
                tabIndex={watchers.length}
                onKeyDown={on(
                  Key2FocusIndex("ArrowUp", watchers.length),
                  Key2FocusIndex("ArrowDown", watchers.length + 1),
                )}
              >
                <PlusIcon className="h-5 w-5" />
                &nbsp;감시자&nbsp;만들기
              </Button>
            )}
          </li>
        </ul>
      </footer>
    </>
  );
}
