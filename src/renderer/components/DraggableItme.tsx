import { Reorder, useDragControls } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  value: any;
  onDragEnd?: () => void;
  children: React.ReactNode;
};

export function DraggableItem(props: Props) {
  const { value, onDragEnd, children } = props;
  const dragCtrl = useDragControls();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current?.querySelector("[data-drag-handle]") as HTMLElement | null;
    if (!element) return;
    const onPointerDown = (e: PointerEvent) => dragCtrl.start(e);
    element.addEventListener("pointerdown", onPointerDown);
    const onClick = (e: MouseEvent) => e.stopPropagation();
    element.addEventListener("click", onClick);
    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <Reorder.Item value={value} dragControls={dragCtrl} dragListener={false} onDragEnd={() => onDragEnd?.()} ref={ref}>
      {children}
    </Reorder.Item>
  );
}
