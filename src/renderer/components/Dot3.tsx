import { useEffect, useState } from "react";

type Props = {
  interval?: number;
};

export function Dot3(props: Props) {
  const { interval = 1000 } = props;
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCount((count) => (count + 1) % 3);
    }, interval);
  }, [count]);

  return ".".repeat(count + 1);
}
