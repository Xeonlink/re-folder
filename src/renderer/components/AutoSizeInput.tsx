import { Input, InputProps } from "./ui/input";
import { ReactHTML, createElement, useEffect, useRef, useState } from "react";

type Props = InputProps & {
  as?: keyof ReactHTML;
  widthOffset?: number;
};

export function AutoSizeInput(props: Props) {
  const { style, onChange, as = "div", widthOffset = 0, ...others } = props;

  const [content, setContent] = useState(others.defaultValue || others.value || "");
  const [width, setWidth] = useState(0);
  const span = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!span.current) return;
    setWidth(span.current.offsetWidth + widthOffset);
  }, [content]);

  return createElement(as, {}, [
    <span key="span" className="max-h-0 absolute bottom-0 left-0 text-transparent" ref={span}>
      {content}
    </span>,
    <Input
      key="input"
      style={{ ...style, width, zIndex: 1 }}
      onChange={(e) => {
        setContent(e.target.value);
        onChange?.(e);
      }}
      {...others}
    />,
  ]);
}
