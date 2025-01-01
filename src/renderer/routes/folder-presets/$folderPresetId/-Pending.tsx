import { PendingFolderUnit } from "./-FolderUnit";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { ArrowRight, Copy, Trash2Icon } from "lucide-react";

export function Pending() {
  return (
    <>
      <ScrollArea className="flex-1">
        <main className="mb-2 flex-1 space-y-2 overflow-y-scroll">
          <Card className="mx-2 mt-2 shadow-none">
            <ul className="m-4 space-y-2">
              <li className="flex items-center">
                <Label htmlFor="name" className="flex-1">
                  이름
                </Label>
                <Input id="name" className="w-56 border-none bg-secondary" size="sm" name="name" />
              </li>
              <li className="flex items-center">
                <Label htmlFor="description" className="flex-1">
                  설명
                </Label>
                <Input id="description" className="w-56 border-none bg-secondary" size="sm" name="description" />
              </li>
            </ul>
          </Card>
          <div className="w-full overflow-x-scroll">
            <PendingFolderUnit />
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
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>적용하기</p>
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
