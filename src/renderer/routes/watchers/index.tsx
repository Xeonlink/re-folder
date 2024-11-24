import { useCreateWatcher, useWatchers } from "@renderer/api/watchers";
import { Button } from "@renderer/components/ui/button";
import { Skeleton } from "@renderer/components/ui/skeleton";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { Pending } from "./-Pending";

export const Route = createFileRoute("/watchers/")({
  component: Page,
  pendingComponent: Pending
});

function Page() {
  const { toast } = useToastWithDismiss();
  const { data: watchers } = useWatchers();
  const create = useCreateWatcher();

  const onCreateClick = async (_: React.MouseEvent<HTMLButtonElement>) => {
    await create.mutateAsync({
      onError: (error) => {
        toast(error.name, error.message);
      }
    });
  };

  return (
    <main className="w-full grid grid-cols-2 px-2 gap-2 mb-2 mt-1">
      {watchers.map((watcher) => (
        <Button variant="outline" className="w-full h-28" asChild key={watcher.id}>
          <Link to="/watchers/$watcherId" params={{ watcherId: watcher.id }}>
            {watcher.name}
          </Link>
        </Button>
      ))}
      {create.isPending ? ( //
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
        <Button variant="outline" className="h-28 border-dashed w-full" onClick={onCreateClick}>
          <PlusIcon />
        </Button>
      )}
    </main>
  );
}
