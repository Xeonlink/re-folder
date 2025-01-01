import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Skeleton } from "@renderer/components/ui/skeleton";

export function Pending() {
  return (
    <ScrollArea className="flex-1">
      <main className="space-y-2 p-2">
        <Card className="shadow-none">
          <ul className="m-4 space-y-2">
            <li className="flex items-center">
              <Label htmlFor="name" className="flex-1">
                이름
              </Label>
              <Skeleton className="h-9 w-56" />
            </li>
            <li className="flex items-center">
              <Label htmlFor="description" className="flex-1">
                설명
              </Label>
              <Skeleton className="h-9 w-56" />
            </li>
            <li className="flex items-center">
              <Label className="flex-1">감시경로</Label>
              <Skeleton className="h-9 w-56" />
            </li>
            <li className="flex items-center">
              <Label className="flex-1">활성화</Label>
              <Skeleton className="h-9 w-56" />
            </li>
            <li className="flex items-center">
              <Label className="flex-1">삭제하기</Label>
              <Skeleton className="h-9 w-56" />
            </li>
          </ul>
        </Card>
        <div className="w-96 space-y-2">
          {new Array(3).fill(0).map((_, i) => (
            <Button key={i} className="h-12 w-96 justify-start" variant="outline">
              <div className="flex-1 text-left">
                <Skeleton className="inline-block h-6 w-20" />
                &nbsp;&nbsp;
                <Skeleton className="inline-block h-4 w-36 text-xs" />
              </div>
              <DragHandleDots2Icon className="ml-2 h-full w-6" />
            </Button>
          ))}
        </div>
        <Button className="h-12 w-96 justify-between border-dashed" variant="outline">
          <span>규칙 만들기</span>
        </Button>
      </main>
    </ScrollArea>
  );
}
