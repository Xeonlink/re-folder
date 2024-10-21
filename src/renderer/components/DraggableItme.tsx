import { DragControls, useDragControls, Reorder } from "framer-motion";

export function DraggableItem(props: {
  value: any;
  onDragEnd?: () => void;
  children: (ctrl: DragControls) => React.ReactNode;
}) {
  const { value, onDragEnd, children } = props;
  const dragCtrl = useDragControls();

  return (
    <Reorder.Item
      value={value}
      dragControls={dragCtrl}
      dragListener={false}
      onDragEnd={() => onDragEnd?.()}
    >
      {children(dragCtrl)}
    </Reorder.Item>
  );
}
