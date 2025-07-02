import { useState, useEffect } from "react";

export function useScreen() {
  const [isLargeScreen, setIsLargeScreen] = useState(() => window.innerWidth >= 1024);
  const [isTablet, setIsTablet] = useState(() => window.innerWidth >= 640 && window.innerWidth < 1024);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;

      const tablet = width >= 640 && width < 1024;
      setIsTablet((prev) => (prev !== tablet ? tablet : prev));

      const large = width >= 1024;
      setIsLargeScreen((prev) => (prev !== large ? large : prev));
    }

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isTablet, isLargeScreen };
}
