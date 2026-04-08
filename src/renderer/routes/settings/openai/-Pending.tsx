import { Card } from "@/renderer/components/ui/card";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";

export function Pending() {
  return (
    <ScrollArea className="flex-1">
      <main className="space-y-2 p-2">
        <Card className="shadow-none">
          <ul className="m-4 space-y-2">
            <li className="flex items-center">
              <Label className="flex-1 font-bold" htmlFor="apikey">
                Open AI
              </Label>
            </li>
            <li className="flex items-center">
              <Label className="flex-1" htmlFor="apikey">
                api key
              </Label>
              <Input
                className="bg-secondary w-56 border-none"
                id="apikey"
                name="apikey"
                size="sm"
              />
            </li>
            <li className="flex items-center">
              <Label className="flex-1" htmlFor="model">
                모델
              </Label>
              <Select name="model">
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="모델 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="gpt-3.5-turbo">
                      gpt 3.5 Turobo
                    </SelectItem>
                    <SelectItem value="gpt-4o-mini">gpt 4o mini</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </li>
          </ul>
        </Card>
      </main>
    </ScrollArea>
  );
}
