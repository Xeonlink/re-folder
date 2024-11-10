import { LucideProps, Wifi, WifiHigh, WifiLow, WifiOff, WifiZero } from "lucide-react";

const length = 5;

type Props = Omit<LucideProps, "ref"> &
  React.RefAttributes<SVGSVGElement> & {
    count: number;
  };

export function WifiSignal(props: Props) {
  const { count, ...others } = props;

  if (count % length === 0) {
    return <WifiZero {...others} />;
  }

  if (count % length === 1) {
    return <WifiLow {...others} />;
  }

  if (count % length === 2) {
    return <WifiHigh {...others} />;
  }

  if (count % length === 3) {
    return <Wifi {...others} />;
  }

  if (count % length === 4) {
    return <WifiOff {...others} />;
  }
}
