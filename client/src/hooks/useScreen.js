import { useState, useEffect } from "react";

export function useScreen() {
  const [isLargeScreen, setIsLargeScreen] = useState(
    () => window.innerWidth >= 1024
  );

  useEffect(() => {
    const onResize = () => {
      const isNowLarge = window.innerWidth >= 1024;
      setIsLargeScreen((prev) => {
        if (prev !== isNowLarge) return isNowLarge;
        return prev; // skip unnecessary update
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isLargeScreen;
}
