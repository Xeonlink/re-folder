import { AutoSizeInput } from "@renderer/components/AutoSizeInput";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Label } from "@renderer/components/ui/label";
import { Skeleton } from "@renderer/components/ui/skeleton";
import { ChevronDownIcon } from "lucide-react";

export function Pending() {
  return (
    <main className="w-full h-full flex flex-col justify-start items-center space-y-2">
      <Card className="w-96 shadow-none">
        <ul className="m-4 space-y-2">
          <li className="flex items-center">
            <Label className="flex-1">이름</Label>
            <Skeleton className="w-56 h-9" />
          </li>
          <li className="flex items-center">
            <Label className="flex-1">설명</Label>
            <Skeleton className="w-56 h-9" />
          </li>
          <li className="flex items-center">
            <Label className="flex-1">출력경로</Label>
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
      <div className="w-96">
        <Button className="w-full h-12 justify-between" variant="secondary">
          <span>접두사</span>
          <ChevronDownIcon size={24} />
        </Button>
        <ul className="mt-2 mx-2 flex flex-row flex-wrap w-full gap-1">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="w-14 h-8" style={{ width: `${i + 4}rem` }} />
          ))}
          <AutoSizeInput className="min-w-14 border-dashed h-8" widthOffset={20} />
        </ul>
      </div>
      <div className="w-96">
        <Button className="w-full h-12 justify-between" variant="secondary">
          <span>접미사</span>
          <ChevronDownIcon size={24} />
        </Button>
        <ul className="mt-2 mx-2 flex flex-row flex-wrap w-full gap-1">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="w-14 h-8" style={{ width: `${i + 4}rem` }} />
          ))}
          <AutoSizeInput className="min-w-14 border-dashed h-8" widthOffset={20} />
        </ul>
      </div>
      <div className="w-96">
        <Button className="w-full h-12 justify-between" variant="secondary">
          <span>확장자</span>
          <ChevronDownIcon size={24} />
        </Button>
        <ul className="mt-2 mx-2 flex flex-row flex-wrap w-full gap-1">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="w-14 h-8" style={{ width: `${i + 4}rem` }} />
          ))}
          <AutoSizeInput className="min-w-14 border-dashed h-8" widthOffset={20} />
        </ul>
      </div>
    </main>
  );
}
