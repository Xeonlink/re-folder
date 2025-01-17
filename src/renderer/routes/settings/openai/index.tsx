import { Pending } from "./-Pending";
import { useOpenAiApiKey, useOpenAiModel, useUpdateOpenAiApiKey, useUpdateOpenAiModel } from "@renderer/api/openai";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/openai/")({
  component: Page,
  pendingComponent: Pending,
});

function Page() {
  const { data: apiKey } = useOpenAiApiKey();
  const { data: model } = useOpenAiModel();
  const { toast } = useToastWithDismiss();
  const updateOpenAiApiKey = useUpdateOpenAiApiKey();
  const updateOpenAiModel = useUpdateOpenAiModel();

  const onApiKeyBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === apiKey) return;
    updateOpenAiApiKey.mutate({
      data: e.target.value,
      onError: () => {
        toast("api key 수정실패", "api key 수정에 실패했습니다.");
        e.target.value = apiKey ?? "";
      },
    });
  };

  const onModelChange = (value: string) => {
    if (value === model) return;
    updateOpenAiModel.mutate({
      data: value,
      onError: () => {
        toast("모델 변경실패", "모델 변경에 실패했습니다.");
      },
    });
  };

  return (
    <ScrollArea className="flex-1">
      <main className="space-y-2 p-2">
        <Card className="shadow-none">
          <ul className="m-4 space-y-2">
            <li className="flex items-center">
              <Label htmlFor="apikey" className="flex-1">
                api key
              </Label>
              <Input
                id="apikey"
                name="apikey"
                className="w-56 border-none bg-secondary"
                size="sm"
                defaultValue={apiKey}
                onBlur={onApiKeyBlur}
              />
            </li>
            <li className="flex items-center">
              <Label htmlFor="model" className="flex-1">
                모델
              </Label>
              <Select name="model" defaultValue={model} onValueChange={onModelChange}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="모델 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="gpt-3.5-turbo">gpt 3.5 Turobo</SelectItem>
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
