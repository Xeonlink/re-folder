import { Button, ButtonProps } from "@renderer/components/ui/button";
import { WifiSignal } from "@renderer/components/WifiSignal";
import { cn } from "@renderer/lib/utils";
import React, { useState } from "react";

const WifiButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, onClick, ...others } = props;
  const [wifiCount, setWifiCount] = useState(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setWifiCount((prev) => prev + 1);
    onClick?.(e);
  };

  return (
    <Button
      className={cn("col-span-2 w-full font-normal", className)}
      size="sm"
      variant="secondary"
      onClick={handleClick}
      ref={ref}
      {...others}
    >
      <WifiSignal count={wifiCount} className="h-5 w-5" />
    </Button>
  );
});
WifiButton.displayName = "WifiButton";

export { WifiButton };
