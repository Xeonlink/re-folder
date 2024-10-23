import { useDeleteRule, useRule, useUpdateRule } from "@renderer/api/rules";
import { AutoSizeInput } from "@renderer/components/AutoSizeInput";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@renderer/components/ui/accordion";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Pending } from "./-Pending";
import { knownExtensions } from "@renderer/assets/knownExtensions";
import { Power, PowerOff, Trash2Icon } from "lucide-react";

export const Route = createFileRoute("/rules/$ruleId/")({
  component: Page,
  pendingComponent: Pending
});

type ArrayKey = "prefix" | "suffix" | "extensions";
type NormalKey = "name" | "description";

function Page() {
  const { ruleId } = Route.useParams();
  const { data: rule } = useRule(ruleId);
  const router = useRouter();
  const { toast } = useToastWithDismiss();

  const updateRule = useUpdateRule(ruleId);
  const deleteRule = useDeleteRule(rule.watcherId, ruleId);

  const onModifyBlur = (key: NormalKey) => async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === rule[key]) return;
    await updateRule.mutateAsync({
      data: { [key]: value },
      onError: (error) => {
        toast(`${key} 변경 실패`, error.message);
        e.target.value = rule[key];
      }
    });
  };

  const onSelectFolderClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    const results = await window.api.selectFolder();
    if (results.canceled) return;
    const target = e.target as HTMLInputElement;
    target.value = results.filePaths[0];
    await updateRule.mutateAsync({
      data: { path: results.filePaths[0] },
      onError: (error) => {
        toast(error.name, error.message);
        target.value = rule.path;
      }
    });
  };

  const onCreateBlur = (key: ArrayKey) => async (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value === "") return;
    if (key === "extensions") value = (value.split(".").pop() ?? value).toLowerCase();
    e.target.value = "";
    if (rule[key].includes(value)) return;

    await updateRule.mutateAsync({
      data: { [key]: [...rule[key], value] },
      onError: (error) => {
        toast(error.name, error.message);
      }
    });
  };

  const enable = (isEnable: boolean) => async (_: React.MouseEvent<HTMLButtonElement>) => {
    if (rule.enabled !== isEnable) {
      await updateRule.mutateAsync({
        data: { enabled: isEnable },
        onError: (error) => {
          const action = isEnable ? "활성화" : "비활성화";
          toast(`${action} 실패`, error.message);
        }
      });
    }
  };

  const modify =
    (key: ArrayKey, index: number) => async (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // 삭제
      if (value === "") {
        const array = [...rule[key]];
        array.splice(index, 1);
        await updateRule.mutateAsync({
          data: { [key]: array },
          onError: (error) => {
            toast(`${key} 삭제 실패`, error.message);
          }
        });
        return;
      }
      // 수정
      if (value !== rule[key][index]) {
        const array = [...rule[key]];
        array[index] = value;
        await updateRule.mutateAsync({
          data: { [key]: array },
          onError: (error) => {
            toast(`${key} 수정 실패`, error.message);
          }
        });
        return;
      }
    };

  const onDeleteClick = async (_: React.MouseEvent<HTMLButtonElement>) => {
    await deleteRule.mutateAsync({
      onError: (error) => {
        toast("삭제 실패", error.message);
      }
    });
    router.history.back();
  };

  return (
    <main className="w-full h-full flex flex-col justify-start items-center">
      <Card className="w-96 shadow-none">
        <ul className="m-4 space-y-2">
          <li className="flex items-center">
            <Label className="flex-1">이름</Label>
            <Input
              className="bg-secondary border-none w-56"
              size="sm"
              defaultValue={rule.name}
              onBlur={onModifyBlur("name")}
            />
          </li>
          <li className="flex items-center">
            <Label className="flex-1">설명</Label>
            <Input
              className="bg-secondary border-none w-56"
              size="sm"
              defaultValue={rule.description}
              onBlur={onModifyBlur("description")}
            />
          </li>
          <li className="flex items-center">
            <Label className="flex-1">출력경로</Label>
            <Input
              className="bg-secondary border-none w-56"
              size="sm"
              onClick={onSelectFolderClick}
              defaultValue={rule.path}
              readOnly
            />
          </li>
          <li className="flex items-center">
            <Label className="flex-1">활성화</Label>
            <div className="flex w-56">
              <Button
                className="w-full rounded-tr-none rounded-br-none"
                size="sm"
                variant={rule.enabled ? "default" : "secondary"}
                onClick={enable(true)}
              >
                <Power className="w-5 h-5" />
              </Button>
              <Button
                className="w-full rounded-tl-none rounded-bl-none"
                size="sm"
                variant={rule.enabled ? "secondary" : "default"}
                onClick={enable(false)}
              >
                <PowerOff className="w-5 h-5" />
              </Button>
            </div>
          </li>
          <li className="flex items-center">
            <Label className="flex-1">삭제하기</Label>
            <Button className="w-56" variant="secondary" size="sm" onClick={onDeleteClick}>
              <Trash2Icon className="w-5 h-5" />
            </Button>
          </li>
        </ul>
      </Card>
      <Accordion type="multiple" className="w-96 my-1">
        <AccordionItem value="접두사" className="border-none">
          <Button className="my-1 w-full h-12 justify-between" variant="secondary" asChild>
            <AccordionTrigger>접두사</AccordionTrigger>
          </Button>
          <AccordionContent className="my-1 mx-2 flex flex-row flex-wrap gap-1 pb-0">
            {rule.prefix.map((prefix, index) => (
              <AutoSizeInput
                key={prefix}
                className="min-w-14 h-8 focus:min-w-20 transition-all"
                defaultValue={prefix}
                widthOffset={20}
                onBlur={modify("prefix", index)}
              />
            ))}
            <AutoSizeInput
              className="min-w-14 h-8 focus:min-w-20 transition-all border-dashed"
              widthOffset={20}
              onBlur={onCreateBlur("prefix")}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="접미사" className="border-none">
          <Button className="my-1 w-full h-12 justify-between" variant="secondary" asChild>
            <AccordionTrigger>접미사</AccordionTrigger>
          </Button>
          <AccordionContent className="my-1 mx-2 flex flex-row flex-wrap gap-1 pb-0">
            {rule.suffix.map((suffix, index) => (
              <AutoSizeInput
                key={suffix}
                className="min-w-14 h-8 focus:min-w-20 transition-all"
                defaultValue={suffix}
                widthOffset={20}
                onBlur={modify("suffix", index)}
              />
            ))}
            <AutoSizeInput
              className="min-w-14 h-8 focus:min-w-20 transition-all border-dashed"
              widthOffset={20}
              onBlur={onCreateBlur("suffix")}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="확장자" className="border-none">
          <Button className="my-1 w-full h-12 justify-between" variant="secondary" asChild>
            <AccordionTrigger>확장자</AccordionTrigger>
          </Button>
          <AccordionContent className="my-1 mx-2 flex flex-row flex-wrap gap-1 pb-0">
            {rule.extensions.map((extension, index) => (
              <AutoSizeInput
                key={extension}
                list="extensions"
                className="min-w-14 h-8 focus:min-w-20 transition-all"
                defaultValue={extension}
                widthOffset={50}
                onBlur={modify("extensions", index)}
              />
            ))}
            <AutoSizeInput
              list="extensions"
              className="min-w-14 h-8 focus:min-w-20 transition-all border-dashed"
              widthOffset={50}
              onBlur={onCreateBlur("extensions")}
            />
            <datalist id="extensions">
              {knownExtensions.map((ext) => (
                <option key={ext} value={ext}></option>
              ))}
            </datalist>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
