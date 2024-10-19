import { useCreateWatcher, useWatchers } from "@renderer/api/watchers";
import { Button } from "@renderer/components/ui/button";
import { Skeleton } from "@renderer/components/ui/skeleton";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Page
});

function Page() {
  const watchers = useWatchers();
  const mutate = useCreateWatcher();

  if (watchers.isLoading) {
    return (
      <main className="w-full h-auto px-2 flex justify-center gap-4 flex-wrap">
        {watchers.isLoading
          ? new Array(5).fill(0).map((_, i) => <Skeleton key={i} className="w-36 h-36" />)
          : null}
      </main>
    );
  }

  if (watchers.isError) {
    return (
      <main className="w-full h-auto px-2 flex justify-center gap-4 flex-wrap">
        <div>{watchers.error.message}</div>
      </main>
    );
  }

  if (watchers.isSuccess) {
    return (
      <main className="w-full h-auto px-2 flex justify-center gap-4 flex-wrap">
        {watchers.data.map((watcher) => (
          <Link to="/watchers/$watcherId" params={{ watcherId: watcher.id }} key={watcher.id}>
            <Button type="button" variant="outline" className="w-36 h-36">
              {watcher.name}
            </Button>
          </Link>
        ))}
        <Button
          type="button"
          variant="outline"
          className="w-36 h-36 border-dashed"
          onClick={() => mutate.mutate()}
        >
          감시 추가
        </Button>
      </main>
    );
  }

  return null;
}
