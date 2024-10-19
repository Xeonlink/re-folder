import { useDeleteRule, useRule, useUpdateRule } from "@renderer/api/rules";
import { AutoSizeInput } from "@renderer/components/AutoSizeInput";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";

export const Route = createFileRoute("/watchers/$watcherId/rules/$ruleId/")({
  component: Page
});

function Page() {
  const { watcherId, ruleId } = Route.useParams();
  const router = useRouter();

  const rule = useRule(watcherId, ruleId);
  const updateRule = useUpdateRule(watcherId, ruleId);
  const deleteRule = useDeleteRule(watcherId, ruleId);

  const onNameChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (name === rule.data?.name) return;
    updateRule.mutate({ name });
  };

  const onSelectFolderClick = async () => {
    const results = await window.dialog.selectFolder();
    if (results.canceled) return;
    updateRule.mutate({ path: results.filePaths[0] });
  };

  const onCreatePrefixBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;
    if (rule.data!.prefix.includes(value)) return;

    e.target.value = "";
    updateRule.mutate({ prefix: [...rule.data!.prefix, value] });
  };

  const modiftPrefix = (index: number) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 삭제
    if (value === "") {
      const prefix = [...rule.data!.prefix];
      prefix.splice(index, 1);
      updateRule.mutate({ prefix });
      return;
    }
    // 수정
    if (value !== rule.data?.prefix[index]) {
      const prefix = [...rule.data!.prefix];
      prefix[index] = value;
      updateRule.mutate({ prefix });
      return;
    }
  };

  const onCreateSuffixBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;
    if (rule.data!.suffix.includes(value)) return;

    e.target.value = "";
    updateRule.mutate({ suffix: [...rule.data!.suffix, value] });
  };

  const modiftSuffix = (index: number) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 삭제
    if (value === "") {
      const suffix = [...rule.data!.suffix];
      suffix.splice(index, 1);
      updateRule.mutate({ suffix });
      return;
    }
    // 수정
    if (value !== rule.data?.suffix[index]) {
      const suffix = [...rule.data!.suffix];
      suffix[index] = value;
      updateRule.mutate({ suffix });
      return;
    }
  };

  const onCreateExtensionBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;
    if (rule.data!.extensions.includes(value)) return;

    e.target.value = "";
    updateRule.mutate({ extensions: [...rule.data!.extensions, value] });
  };

  const modiftExtensions = (index: number) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 삭제
    if (value === "") {
      const extensions = [...rule.data!.extensions];
      extensions.splice(index, 1);
      updateRule.mutate({ extensions });
      return;
    }
    // 수정
    if (value !== rule.data?.extensions[index]) {
      const extensions = [...rule.data!.extensions];
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
              defaultValue={rule.data?.name}
              onBlur={(e) => onNameChange(e)}
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
              {rule.data?.path}
            </Button>
          </li>
          <li className="flex items-center">
            <Label className="flex-1">활성화</Label>
            <div className="flex w-56">
              <Button
                className="w-full rounded-tr-none rounded-br-none"
                size="sm"
                variant={rule.data?.enabled ? "default" : "secondary"}
                onClick={() => {
                  if (!rule.data?.enabled) {
                    updateRule.mutate({ enabled: true });
                  }
                }}
              >
                켜짐
              </Button>
              <Button
                className="w-full rounded-tl-none rounded-bl-none"
                size="sm"
                variant={rule.data?.enabled ? "secondary" : "default"}
                onClick={() => {
                  if (rule.data?.enabled) {
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
          {rule.data?.prefix.map((prefix, index) => (
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
          {rule.data?.suffix.map((suffix, index) => (
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
          {rule.data?.extensions.map((extension, index) => (
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
