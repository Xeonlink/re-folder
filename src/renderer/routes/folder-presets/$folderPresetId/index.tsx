import {
  useApplyFolderPreset,
  useDeleteFolderPreset,
  useFolderPreset,
  useUpdateFolderPreset
} from "@renderer/api/folderPresets";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowRight, Trash2Icon } from "lucide-react";
import { FolderUnit } from "./-FolderUnit";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";

export const Route = createFileRoute("/folder-presets/$folderPresetId/")({
  component: Page
});

type NormalKey = "name" | "description";

function Page() {
  const { folderPresetId } = Route.useParams();

  const router = useRouter();
  const { toast } = useToastWithDismiss();
  const { data: folderPreset } = useFolderPreset(folderPresetId);
  const deleteFolderPreset = useDeleteFolderPreset(null, folderPresetId);
  const updateFolderPreset = useUpdateFolderPreset(folderPresetId);
  const applyFolderPreset = useApplyFolderPreset(folderPresetId);

  const onModifyBlur = (key: NormalKey) => async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === folderPreset[key]) return;
    await updateFolderPreset.mutateAsync({
      data: { [key]: value },
      onError: (error) => {
        toast(error.name, error.message);
        e.target.value = folderPreset[key];
      }
    });
  };

  const onApplyClick = async () => {
    await applyFolderPreset.mutateAsync({
      onError: (error) => {
        toast(error.name, error.message);
      },
      onSuccess: () => {
        toast("적용 완료", "폴더 프리셋이 적용되었습니다.");
      }
    });
  };

  const onDeleteClick = () => {
    deleteFolderPreset.mutate({
      onError: (error) => {
        toast(error.name, error.message);
      }
    });
    router.history.back();
  };

  return (
    <main className="w-full mb-2 space-y-2">
      <Card className="w-96 shadow-none mx-2">
        <ul className="m-4 space-y-2">
          <li className="flex items-center">
            <Label htmlFor="name" className="flex-1">
              이름
            </Label>
            <Input
              id="name"
              className="bg-secondary border-none w-56"
              size="sm"
              name="name"
              defaultValue={folderPreset.name}
              onBlur={onModifyBlur("name")}
            />
          </li>
          <li className="flex items-center">
            <Label htmlFor="description" className="flex-1">
              설명
            </Label>
            <Input
              id="description"
              className="bg-secondary border-none w-56"
              size="sm"
              name="description"
              defaultValue={folderPreset.description}
              onBlur={onModifyBlur("description")}
            />
          </li>
          <li className="flex items-center">
            <Label className="flex-1">적용하기</Label>
            <Button className="w-56" variant="secondary" size="sm" onClick={onApplyClick}>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </li>
          <li className="flex items-center">
            <Label className="flex-1">삭제하기</Label>
            <Button className="w-56" variant="secondary" size="sm" onClick={onDeleteClick}>
              <Trash2Icon className="w-5 h-5" />
            </Button>
          </li>
        </ul>
      </Card>
      <div className="w-full overflow-x-scroll">
        <FolderUnit folderPresetId={folderPresetId} depts={1} />
      </div>
    </main>
  );
}
