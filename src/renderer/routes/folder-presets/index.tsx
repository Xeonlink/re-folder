import { useCreateFolderPreset, useRootFolderPresets } from "@renderer/api/folderPresets";
import { Button } from "@renderer/components/ui/button";
import { Skeleton } from "@renderer/components/ui/skeleton";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { Pending } from "./-Pending";

export const Route = createFileRoute("/folder-presets/")({
  component: Page,
  pendingComponent: Pending
});

export function Page() {
  const { toast } = useToastWithDismiss();
  const { data: folderPresets } = useRootFolderPresets();
  const createFolderPreset = useCreateFolderPreset(null);

  const onCreateClick = async (_: React.MouseEvent<HTMLButtonElement>) => {
    await createFolderPreset.mutateAsync({
      onError: (error) => {
        toast(error.name, error.message);
      }
    });
  };

  return (
    <main className="w-full grid grid-cols-2 px-2 gap-2 mb-2 mt-1">
      {folderPresets.map((preset) => (
        <Button variant="outline" className="w-full h-28" asChild key={preset.id}>
          <Link to="/folder-presets/$folderPresetId" params={{ folderPresetId: preset.id }}>
            {preset.name}
          </Link>
        </Button>
      ))}
      {createFolderPreset.isPending ? ( //
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
