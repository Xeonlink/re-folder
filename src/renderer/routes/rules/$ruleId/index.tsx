import { Label } from "@radix-ui/react-dropdown-menu";
import { useDeleteRule, useUpdateRule } from "@renderer/api/rules";
import { AutoSizeInput } from "@renderer/components/AutoSizeInput";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";

export const Route = createFileRoute("/rules/$ruleId/")({
  loader: async ({ params }) => ({
    rule: await window.api.getRule(params.ruleId)
  }),
  component: Page
});

function Page() {
  const { ruleId } = Route.useParams();
  const { rule } = Route.useLoaderData();
  const router = useRouter();

  const updateRule = useUpdateRule(ruleId);
  const deleteRule = useDeleteRule(ruleId);

  const onNameChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (name === rule.name) return;
    updateRule.mutate({ name });
  };

  const onDescriptionChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const description = e.target.value;
    if (description === rule.description) return;
    updateRule.mutate({ description });
  };

  const onSelectFolderClick = async () => {
    const results = await window.api.selectFolder();
    if (results.canceled) return;
    updateRule.mutate({ path: results.filePaths[0] });
  };

  const onCreatePrefixBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;
    if (rule.prefix.includes(value)) return;

    e.target.value = "";
    updateRule.mutate({ prefix: [...rule.prefix, value] });
  };

  const modiftPrefix = (index: number) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 삭제
    if (value === "") {
      const prefix = [...rule.prefix];
      prefix.splice(index, 1);
      updateRule.mutate({ prefix });
      return;
    }
    // 수정
    if (value !== rule.prefix[index]) {
      const prefix = [...rule.prefix];
      prefix[index] = value;
      updateRule.mutate({ prefix });
      return;
    }
  };

  const onCreateSuffixBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;
    if (rule.suffix.includes(value)) return;

    e.target.value = "";
    updateRule.mutate({ suffix: [...rule.suffix, value] });
  };

  const modiftSuffix = (index: number) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 삭제
    if (value === "") {
      const suffix = [...rule.suffix];
      suffix.splice(index, 1);
      updateRule.mutate({ suffix });
      return;
    }
    // 수정
    if (value !== rule.suffix[index]) {
      const suffix = [...rule.suffix];
      suffix[index] = value;
      updateRule.mutate({ suffix });
      return;
    }
  };

  const onCreateExtensionBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;
    if (rule.extensions.includes(value)) return;

    e.target.value = "";
    updateRule.mutate({ extensions: [...rule.extensions, value] });
  };

  const modiftExtensions = (index: number) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 삭제
    if (value === "") {
      const extensions = [...rule.extensions];
      extensions.splice(index, 1);
      updateRule.mutate({ extensions });
      return;
    }
    // 수정
    if (value !== rule.extensions[index]) {
      const extensions = [...rule.extensions];
      extensions[index] = value;
      updateRule.mutate({ extensions });
      return;
    }
  };

  return (
    <main className="w-full h-full flex flex-col justify-start items-center space-y-2">
      <Card className="w-96 shadow-none">
        <ul className="m-4 space-y-2">
          <li className="flex items-center">
            <Label className="flex-1">이름</Label>
            <Input
              className="bg-secondary border-none w-56"
              size="sm"
              defaultValue={rule.name}
              onBlur={(e) => onNameChange(e)}
            />
          </li>
          <li className="flex items-center">
            <Label className="flex-1">설명</Label>
            <Input
              className="bg-secondary border-none w-56"
              size="sm"
              defaultValue={rule.description}
              onBlur={(e) => onDescriptionChange(e)}
            />
          </li>
          <li className="flex items-center">
            <Label className="flex-1">출력경로</Label>
            <Button
              variant="secondary"
              size="sm"
              className="w-56 justify-start"
              onClick={onSelectFolderClick}
            >
              {rule.path}
            </Button>
          </li>
          <li className="flex items-center">
            <Label className="flex-1">활성화</Label>
            <div className="flex w-56">
              <Button
                className="w-full rounded-tr-none rounded-br-none"
                size="sm"
                variant={rule.enabled ? "default" : "secondary"}
                onClick={() => {
                  if (!rule.enabled) {
                    updateRule.mutate({ enabled: true });
                  }
                }}
              >
                켜짐
              </Button>
              <Button
                className="w-full rounded-tl-none rounded-bl-none"
                size="sm"
                variant={rule.enabled ? "secondary" : "default"}
                onClick={() => {
                  if (rule.enabled) {
                    updateRule.mutate({ enabled: false });
                  }
                }}
              >
                꺼짐
              </Button>
            </div>
          </li>
          <li className="flex items-center">
            <Label className="flex-1">삭제하기</Label>
            <Button
              className="w-56"
              variant="secondary"
              size="sm"
              onClick={async () => {
                await deleteRule.mutateAsync();
                router.history.back();
              }}
            >
              삭제하기
            </Button>
          </li>
        </ul>
      </Card>
      <div className="w-96">
        <Button className="w-full h-12 justify-between" variant="secondary">
          <span>접두사</span>
          <ChevronDownIcon size={24} />
        </Button>
        <ul className="mt-2 mx-2 flex flex-row flex-wrap w-full gap-1">
          {rule.prefix.map((prefix, index) => (
            <AutoSizeInput
              key={prefix}
              className="min-w-14 h-8"
              defaultValue={prefix}
              widthOffset={20}
              onBlur={modiftPrefix(index)}
            />
          ))}
          <AutoSizeInput
            className="min-w-14 border-dashed h-8"
            widthOffset={20}
            onBlur={onCreatePrefixBlur}
          />
        </ul>
      </div>
      <div className="w-96">
        <Button className="w-full h-12 justify-between" variant="secondary">
          <span>접미사</span>
          <ChevronDownIcon size={24} />
        </Button>
        <ul className="mt-2 mx-2 flex flex-row flex-wrap w-full gap-1">
          {rule.suffix.map((suffix, index) => (
            <AutoSizeInput
              key={suffix}
              className="min-w-14 h-8"
              defaultValue={suffix}
              widthOffset={20}
              onBlur={modiftSuffix(index)}
            />
          ))}
          <AutoSizeInput
            className="min-w-14 border-dashed h-8"
            widthOffset={20}
            onBlur={onCreateSuffixBlur}
          />
        </ul>
      </div>
      <div className="w-96">
        <Button className="w-full h-12 justify-between" variant="secondary">
          <span>확장자</span>
          <ChevronDownIcon size={24} />
        </Button>
        <ul className="mt-2 mx-2 flex flex-row flex-wrap w-full gap-1">
          {rule.extensions.map((extension, index) => (
            <AutoSizeInput
              key={extension}
              className="min-w-14 h-8"
              defaultValue={extension}
              widthOffset={20}
              onBlur={modiftExtensions(index)}
            />
          ))}
          <AutoSizeInput
            className="min-w-14 border-dashed h-8"
            widthOffset={20}
            onBlur={onCreateExtensionBlur}
          />
        </ul>
      </div>
    </main>
  );
}
