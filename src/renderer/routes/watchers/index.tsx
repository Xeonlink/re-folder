import { useCreateWatcher, useWatchers } from "@renderer/api/watchers";
import { Dot3 } from "@renderer/components/Dot3";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Pending } from "./-Pending";
import { on } from "@renderer/lib/utils";
import { keyboardMoveToTabIndex } from "@renderer/lib/arrowNavigation";

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

  return (
    <>
      <ScrollArea className="flex-1">
        <main className="p-2">
          <ol className="contents">
            {watchers.map((watcher, index) => (
              <li className="contents" key={watcher.id}>
                <Button
                  variant="ghost"
                  className="h-16 w-full flex-col items-start"
                  autoFocus={index === 0}
                  tabIndex={index + 1}
                  onClick={gotoWatcher(watcher.id)}
                  onKeyDown={on(
                    keyboardMoveToTabIndex("ArrowUp", index),
                    keyboardMoveToTabIndex("ArrowDown", index + 2),
                  )}
                >
                  <h5 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{watcher.name}</h5>
                  <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                    {watcher.description}
                  </p>
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
              onClick={createWatcher}
              disabled={creator.isPending}
            >
              {creator.isPending ? (
                <>
                  <PlusIcon className="h-5 w-5 animate-spin" />
                  &nbsp;감시자&nbsp;생성 중<Dot3 />
                </>
              ) : (
                <>
                  <PlusIcon className="h-5 w-5" />
                  &nbsp;감시자&nbsp;만들기
                </>
              )}
            </Button>
          </li>
        </ul>
      </footer>
    </>
  );
}
