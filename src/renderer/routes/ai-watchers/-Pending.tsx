import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Skeleton } from "@renderer/components/ui/skeleton";

export function Pending() {
  return (
    <ScrollArea className="flex-1">
      <main className="grid grid-cols-2 gap-2 p-2">
        {new Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
        <Button variant="outline" className="h-28 w-full border-dashed">
          <DotsHorizontalIcon className="h-8 w-8" />
        </Button>
      </main>
    </ScrollArea>
  );
}
