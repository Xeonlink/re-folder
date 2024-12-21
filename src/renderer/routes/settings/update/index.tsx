import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { createFileRoute } from "@tanstack/react-router";
import { Server } from "lucide-react";

export const Route = createFileRoute("/settings/update/")({
  component: Page,
});

function Page() {
  return (
    <ScrollArea className="flex-1">
      <main className="p-2 space-y-2">
        <Card className="shadow-none">
          <ul className="m-4 space-y-2">
            <li className="flex items-center">
              <Label htmlFor="check-update" className="flex-1">
                업데이트 확인
              </Label>
              <Button className="w-56" variant="secondary" size="sm" id="check-update" disabled>
                <Server className="w-5 h-5" />
                &nbsp;
                <MagnifyingGlassIcon className="w-5 h-5" />
                준비중
              </Button>
            </li>
          </ul>
        </Card>
      </main>
    </ScrollArea>
  );
}
