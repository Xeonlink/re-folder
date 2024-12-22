import { Pending } from "./-Pending";
import { useCopyRule, useDeleteRule, useRule, useUpdateRule } from "@renderer/api/rules";
import { knownExtensions } from "@renderer/assets/knownExtensions";
import { AutoSizeInput } from "@renderer/components/AutoSizeInput";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@renderer/components/ui/accordion";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { useShortcuts } from "@renderer/hooks/useShortcuts";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { cn } from "@renderer/lib/utils";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Copy, Power, PowerOff, Trash2Icon } from "lucide-react";

export const Route = createFileRoute("/rules/$ruleId/")({
  component: Page,
  pendingComponent: Pending,
});

type ArrayKey = "prefix" | "suffix" | "extensions";
type NormalKey = "name" | "description";

function Page() {
  const { ruleId } = Route.useParams();
  const { data: rule } = useRule(ruleId);
  const router = useRouter();
  const { toast } = useToastWithDismiss();

  const copior = useCopyRule(rule.watcherId, ruleId);
  const updator = useUpdateRule(ruleId);
  const deletor = useDeleteRule(rule.watcherId, ruleId);

  const onModifyBlur = (key: NormalKey) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === rule[key]) return;
    updator.mutate({
      data: { [key]: value },
      onError: (error) => {
        toast(`${key} 변경 실패`, error.message);
        e.target.value = rule[key];
      },
    });
  };

  const onSelectFolderClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    const results = await window.api.selectFolder();
    if (results.canceled) return;
    const target = e.target as HTMLInputElement;
    target.value = results.filePaths[0];
    updator.mutate({
      data: { path: results.filePaths[0] },
      onError: (error) => {
        toast(error.name, error.message);
        target.value = rule.path;
      },
    });
  };

  const onCreateBlur = (key: ArrayKey) => (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value === "") return;
    if (key === "extensions") value = (value.split(".").pop() ?? value).toLowerCase();
    e.target.value = "";
    if (rule[key].includes(value)) return;

    updator.mutate({
      data: { [key]: [...rule[key], value] },
      onError: (error) => toast(error.name, error.message),
    });
  };

  const toggle = () => {
    const isEnable = !rule.enabled;
    updator.mutate({
      data: { enabled: isEnable },
      onError: (error) => {
        const action = isEnable ? "활성화" : "비활성화";
        toast(`${action} 실패`, error.message);
      },
    });
  };

  const modify = (key: ArrayKey, index: number) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 삭제
    if (value === "") {
      const array = [...rule[key]];
      array.splice(index, 1);
      updator.mutate({
        data: { [key]: array },
        onError: (error) => toast(`${key} 삭제 실패`, error.message),
      });
      return;
    }
    // 수정
    if (value !== rule[key][index]) {
      const array = [...rule[key]];
      array[index] = value;
      updator.mutate({
        data: { [key]: array },
        onError: (error) => toast(`${key} 수정 실패`, error.message),
      });
      return;
    }
  };

  const copy = () => {
    copior.mutate({
      onError: (error) => toast("복사 실패", error.message),
      onSuccess: () => router.history.back(),
    });
  };
  const deleteThis = () => {
    deletor.mutate({
      onError: (error) => toast("삭제 실패", error.message),
      onSuccess: () => router.history.back(),
    });
  };

  useShortcuts(
    {
      win32: {
        "ctrl+delete": deleteThis,
        "ctrl+d": copy,
        "ctrl+t": toggle,
      },
      darwin: {
        "meta+backspace": deleteThis,
        "meta+d": copy,
        "meta+t": toggle,
      },
    },
    [rule],
  );

  return (
    <>
      <ScrollArea className="flex-1">
        <main className="p-2 space-y-2">
          <Card className={cn("shadow-none", { "border-primary": rule.enabled })}>
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
            </ul>
          </Card>
          <Accordion type="multiple" className="space-y-2">
            <AccordionItem value="접두사" className="border-none">
              <Button className="h-12 justify-between" variant="secondary" asChild>
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
              <Button className="h-12 justify-between" variant="secondary" asChild>
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
              <Button className="h-12 justify-between" variant="secondary" asChild>
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
                    onClick={toggle}
                  >
                    {rule.enabled ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{rule.enabled ? "비활성화 하기" : "활성화 하기"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="w-full rounded-none gap-1.5 h-full flex-col" variant="secondary" onClick={copy}>
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
                    onClick={deleteThis}
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
