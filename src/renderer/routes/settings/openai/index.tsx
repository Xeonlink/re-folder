import { Label } from "@radix-ui/react-label";
import {
  useOpenAiApiKey,
  useOpenAiModel,
  useUpdateOpenAiApiKey,
  useUpdateOpenAiModel
} from "@renderer/api/openai";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@renderer/components/ui/select";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { createFileRoute } from "@tanstack/react-router";
import { Pending } from "./-Pending";

export const Route = createFileRoute("/settings/openai/")({
  component: Page,
  pendingComponent: Pending
});

function Page() {
  const { data: apiKey } = useOpenAiApiKey();
  const { data: model } = useOpenAiModel();
  const { toast } = useToastWithDismiss();
  const updateOpenAiApiKey = useUpdateOpenAiApiKey();
  const updateOpenAiModel = useUpdateOpenAiModel();

  const onApiKeyBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === apiKey) return;
    await updateOpenAiApiKey.mutateAsync({
      data: e.target.value,
      onError: () => {
        toast("api key 수정실패", "api key 수정에 실패했습니다.");
        e.target.value = apiKey ?? "";
      }
    });
  };

  const onModelChange = async (value: string) => {
    if (value === model) return;
    await updateOpenAiModel.mutateAsync({
      data: value,
      onError: () => {
        toast("모델 변경실패", "모델 변경에 실패했습니다.");
      }
    });
  };

  return (
    <main className="w-full flex flex-col justify-start items-center mb-2 space-y-2">
      <Card className="w-96 shadow-none">
        <ul className="m-4 space-y-2">
          <li className="flex items-center">
            <Label htmlFor="apikey" className="flex-1 font-bold">
              Open AI
            </Label>
          </li>
          <li className="flex items-center">
            <Label htmlFor="apikey" className="flex-1">
              api key
            </Label>
            <Input
              id="apikey"
              name="apikey"
              className="bg-secondary border-none w-56"
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
  );
}
