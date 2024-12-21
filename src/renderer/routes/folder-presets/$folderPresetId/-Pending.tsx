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
        <main className="mb-2 space-y-2 flex-1 overflow-y-scroll">
          <Card className="shadow-none mx-2 mt-2">
            <ul className="m-4 space-y-2">
              <li className="flex items-center">
                <Label htmlFor="name" className="flex-1">
                  이름
                </Label>
                <Input id="name" className="bg-secondary border-none w-56" size="sm" name="name" />
              </li>
              <li className="flex items-center">
                <Label htmlFor="description" className="flex-1">
                  설명
                </Label>
                <Input id="description" className="bg-secondary border-none w-56" size="sm" name="description" />
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
                    className="w-full rounded-none rounded-bl-md items-center gap-1 flex-col h-full"
                    variant="secondary"
                    size="default"
                  >
                    <ArrowRight className="w-5 h-5" />
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
                  <Button className="w-full rounded-none gap-1.5 h-full flex-col" variant="secondary" size="default">
                    <Copy className="w-5 h-5" />
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
                  <Button
                    className="w-full rounded-none rounded-br-md gap-1.5 h-full flex-col"
                    variant="secondary"
                    size="default"
                  >
                    <Trash2Icon className="w-5 h-5" />
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
