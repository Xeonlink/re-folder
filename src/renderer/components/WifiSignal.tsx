import { LucideProps, Wifi, WifiHigh, WifiLow, WifiOff, WifiZero } from "lucide-react";

const length = 5;

type Props = Omit<LucideProps, "ref"> &
  React.RefAttributes<SVGSVGElement> & {
    count: number;
  };

export function WifiSignal(props: Props) {
  const { count, ...others } = props;
  const remain = count % length;

  if (remain === 0) {
    return <WifiZero {...others} />;
  }

  if (remain === 1) {
    return <WifiLow {...others} />;
  }

  if (remain === 2) {
    return <WifiHigh {...others} />;
  }

  if (remain === 3) {
    return <Wifi {...others} />;
  }

  if (remain === 4) {
    return <WifiOff {...others} />;
  }

  return <Wifi {...others} />;
}
