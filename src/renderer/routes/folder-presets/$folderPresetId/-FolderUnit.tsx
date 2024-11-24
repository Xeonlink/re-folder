import {
  useCreateFolderPreset,
  useDeleteFolderPreset,
  useFolderPreset,
  useUpdateFolderPreset
} from "@renderer/api/folderPresets";
import { Button } from "@renderer/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@renderer/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import { useToastWithDismiss } from "@renderer/hooks/useToastWithDismiss";
import { cn } from "@renderer/lib/utils";
import { ChevronRight, Folder, FolderOpen } from "lucide-react";
import { useState } from "react";

type Props = {
  folderPresetId: string;
  depts: number;
};

type NormalKey = "name" | "description";

export function FolderUnit(props: Props) {
  const { folderPresetId, depts } = props;

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const { toast } = useToastWithDismiss();
  const { data: folderPreset } = useFolderPreset(folderPresetId);
  const createFolderPreset = useCreateFolderPreset(folderPresetId);
  const updateFolderPreset = useUpdateFolderPreset(folderPresetId);
  const deleteFolderPreset = useDeleteFolderPreset(folderPreset.parentId, folderPresetId);

  const onModifyBlur = (key: NormalKey) => async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === folderPreset[key]) return;
    await updateFolderPreset.mutateAsync({
      data: { [key]: value },
      onError: (error) => {
        console.log(error);
        toast(error.name, error.message);
        e.target.value = folderPreset[key];
      }
    });
  };

  const onCreateFolderPresetClick = async () => {
    await createFolderPreset.mutateAsync({
      onError: (error) => {
        toast(error.name, error.message);
      },
      onSuccess: () => {
        setOpen(true);
      }
    });
  };

  const onDeleteFolderPresetClick = async () => {
    await deleteFolderPreset.mutateAsync({
      onError: (error) => {
        toast(error.name, error.message);
      }
    });
  };

  const onButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "F2") {
      if (folderPreset.parentId !== null) {
        e.preventDefault();
        setEdit(true);
        return;
      }
    }

    if (e.key === "ArrowRight") {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowLeft") {
      setOpen(false);
      return;
    }
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <Button
            variant="ghost"
            className="py-0 font-normal rounded-none min-w-full justify-start focus:bg-secondary focus:outline-none focus:border-none items-center h-8 focus-visible:ring-0"
            style={{ paddingLeft: `${depts}rem` }}
            onClick={() => setOpen((prev) => !prev)}
            onKeyDown={onButtonKeyDown}
          >
            <ChevronRight className={cn("w-4 h-4 transition-all", { "rotate-90": open })} />
            &nbsp;
            {open ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
            &nbsp;&nbsp;
            <span>{folderPreset.name}</span>
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          {folderPreset.parentId !== null ? (
            <ContextMenuItem onClick={() => setEdit(true)}>이름 바꾸기</ContextMenuItem>
          ) : null}
          <ContextMenuItem onClick={onCreateFolderPresetClick}>새로운 폴더</ContextMenuItem>
          {folderPreset.parentId !== null ? (
            <ContextMenuItem onClick={onDeleteFolderPresetClick}>삭제하기</ContextMenuItem>
          ) : null}
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={edit} onOpenChange={setEdit}>
        <DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogTitle>
        <DialogContent
          className="w-64 bg-transparent border-none outline-none p-0"
          hideDefaultClose
        >
          <Input id="name" defaultValue={folderPreset.name} onBlur={onModifyBlur("name")} />
        </DialogContent>
      </Dialog>

      <div className={cn("", { hidden: !open })}>
        {folderPreset.children?.map((id) => (
          <FolderUnit key={id} folderPresetId={id} depts={depts + 1} />
        ))}
      </div>
    </div>
  );
}
