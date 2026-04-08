import { Button } from "@/renderer/components/ui/button";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import { Skeleton } from "@/renderer/components/ui/skeleton";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export function Pending() {
  return (
    <ScrollArea className="flex-1">
      <main className="grid grid-cols-2 gap-2 p-2">
        {new Array(4).fill(0).map((_, i) => (
          <Skeleton className="h-28" key={i} />
        ))}
        <Button className="h-28 w-full border-dashed" variant="outline">
          <DotsHorizontalIcon className="h-8 w-8" />
        </Button>
      </main>
    </ScrollArea>
  );
}
