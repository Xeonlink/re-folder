import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Label } from "@renderer/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";
import { Server } from "lucide-react";

export const Route = createFileRoute("/settings/update/")({
  component: Page,
});

function Page() {
  return (
    <main className="w-full flex flex-col justify-start items-center mb-2 space-y-2">
      <Card className="w-96 shadow-none">
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
  );
}
