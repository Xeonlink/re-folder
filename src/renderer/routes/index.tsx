import { DotsHorizontalIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useCreateWatcher } from "@renderer/api/watchers";
import { Button } from "@renderer/components/ui/button";
import { Skeleton } from "@renderer/components/ui/skeleton";
import { Textarea } from "@renderer/components/ui/textarea";
import { testPromise } from "@renderer/lib/utils";
import { createFileRoute, ErrorComponentProps, Link, useRouter } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Page,
  loader: async () => await testPromise(window.api.getWatchers(), 0, false),
  pendingComponent: Pending,
  errorComponent: Fail
});

function Page() {
  const watchers = Route.useLoaderData();
  const create = useCreateWatcher();

  return (
    <main className="w-full grid grid-cols-2 px-2 gap-2 mb-2 mt-1">
      {watchers.map((watcher) => (
        <Button variant="outline" className="w-full h-28" asChild key={watcher.id}>
          <Link to="/watchers/$watcherId" params={{ watcherId: watcher.id }}>
            {watcher.name}
          </Link>
        </Button>
      ))}
      <Button
        variant="outline"
        className="h-28 border-dashed w-full"
        onClick={() => create.mutate()}
      >
        <PlusIcon />
      </Button>
    </main>
  );
}

function Pending() {
  return (
    <main className="w-full grid grid-cols-2 px-2 gap-2 mb-2 mt-1">
      {new Array(4).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-28" />
      ))}
      <Button variant="outline" className="h-28 border-dashed w-full">
        <DotsHorizontalIcon className="w-8 h-8" />
      </Button>
    </main>
  );
}

function Fail(props: ErrorComponentProps) {
  const { error, reset, info } = props;
  const { message, name, cause, stack } = error;
  const componentStack = info?.componentStack ?? "";
  const errorString = JSON.stringify({ message, name, cause, stack, componentStack }, null, 2);

  const router = useRouter();

  const onResetClick = () => {
    router.invalidate();
    reset();
  };

  return (
    <main className="w-full px-2 mb-2 mt-1 text-end">
      <Textarea className="w-full" id="message" rows={20} value={errorString} readOnly />
      <Button onClick={onResetClick} variant="outline" size="lg" className="mt-2">
        <UpdateIcon />
        &nbsp;새로고침
      </Button>
    </main>
  );
}
