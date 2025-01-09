import { AutoSizeInput } from "@renderer/components/AutoSizeInput";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Skeleton } from "@renderer/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { ChevronDownIcon, Copy, Power, Trash2Icon } from "lucide-react";

export function Pending() {
  return (
    <>
      <ScrollArea className="flex-1">
        <main className="space-y-2 p-2">
          <Card className="shadow-none">
            <ul className="m-4 space-y-2">
              <li className="flex items-center">
                <Label className="flex-1">이름</Label>
                <Skeleton className="h-9 w-56" />
              </li>
              <li className="flex items-center">
                <Label className="flex-1">설명</Label>
                <Skeleton className="h-9 w-56" />
              </li>
              <li className="flex items-center">
                <Label className="flex-1">출력경로</Label>
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
          <div className="w-96">
            <Button className="h-12 w-full justify-between" variant="secondary">
              <span>접두사</span>
              <ChevronDownIcon size={24} />
            </Button>
            <ul className="mx-2 mt-2 flex w-full flex-row flex-wrap gap-1">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-8 w-14" style={{ width: `${i + 4}rem` }} />
              ))}
              <AutoSizeInput className="h-8 min-w-14 border-dashed" widthOffset={20} />
            </ul>
          </div>
          <div className="w-96">
            <Button className="h-12 w-full justify-between" variant="secondary">
              <span>접미사</span>
              <ChevronDownIcon size={24} />
            </Button>
            <ul className="mx-2 mt-2 flex w-full flex-row flex-wrap gap-1">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-8 w-14" style={{ width: `${i + 4}rem` }} />
              ))}
              <AutoSizeInput className="h-8 min-w-14 border-dashed" widthOffset={20} />
            </ul>
          </div>
          <div className="w-96">
            <Button className="h-12 w-full justify-between" variant="secondary">
              <span>확장자</span>
              <ChevronDownIcon size={24} />
            </Button>
            <ul className="mx-2 mt-2 flex w-full flex-row flex-wrap gap-1">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-8 w-14" style={{ width: `${i + 4}rem` }} />
              ))}
              <AutoSizeInput className="h-8 min-w-14 border-dashed" widthOffset={20} />
            </ul>
          </div>
        </main>
      </ScrollArea>
      <footer>
        <ul className="flex h-12">
          <li className="w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-full w-full flex-col items-center gap-1 rounded-none rounded-bl-md"
                    variant="secondary"
                  >
                    <Power className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>활성화 하기</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="h-full w-full flex-col gap-1.5 rounded-none" variant="secondary">
                    <Copy className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>복사하기</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="h-full w-full flex-col gap-1.5 rounded-none rounded-br-md" variant="secondary">
                    <Trash2Icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>즉시 삭제하기</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </footer>
    </>
  );
}
