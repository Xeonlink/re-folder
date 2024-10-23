import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Label } from "@renderer/components/ui/label";
import { Skeleton } from "@renderer/components/ui/skeleton";

export function Pending() {
  return (
    <main className="w-full flex flex-col justify-start items-center mb-2 space-y-2">
      <Card className="w-96 shadow-none">
        <ul className="m-4 space-y-2">
          <li className="flex items-center">
            <Label htmlFor="name" className="flex-1">
              이름
            </Label>
            <Skeleton className="w-56 h-9" />
          </li>
          <li className="flex items-center">
            <Label htmlFor="description" className="flex-1">
              설명
            </Label>
            <Skeleton className="w-56 h-9" />
          </li>
          <li className="flex items-center">
            <Label className="flex-1">감시경로</Label>
            <Skeleton className="w-56 h-9" />
          </li>
          <li className="flex items-center">
            <Label className="flex-1">활성화</Label>
            <Skeleton className="w-56 h-9" />
          </li>
          <li className="flex items-center">
            <Label className="flex-1">삭제하기</Label>
            <Skeleton className="w-56 h-9" />
          </li>
        </ul>
      </Card>
      <div className="space-y-2 w-96">
        {new Array(3).fill(0).map((_, i) => (
          <Button key={i} className="w-96 justify-start h-12" variant="outline">
            <div className="flex-1 text-left">
              <Skeleton className="w-20 h-6 inline-block" />
              &nbsp;&nbsp;
              <Skeleton className="text-xs w-36 h-4 inline-block" />
            </div>
            <DragHandleDots2Icon className="w-6 h-full ml-2" />
          </Button>
        ))}
      </div>
      <Button className="w-96 justify-between h-12 border-dashed" variant="outline">
        <span>규칙 만들기</span>
      </Button>
    </main>
  );
}
