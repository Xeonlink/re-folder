import { useEffect, useState } from "react";

export function useUpdateInfo() {
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    return window.subscribe.checkingForUpdate((checking) => {
      setIsChecking(checking);
    });
  }, []);

  return;
}
