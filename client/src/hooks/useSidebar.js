import { useEffect, useMemo, useState, useCallback } from "react";

export function useSidebarLogic(routes) {
  const [sidebarWidth, setSidebarWidth] = useState(275);
  const [isResizing, setIsResizing] = useState(false);
  const memoizedRoutes = useMemo(() => routes, [routes]);

  const resizeSidebar = useCallback(
    (e) => {
      if (isResizing) {
        e.preventDefault();
        document.body.style.userSelect = "none";
        const newWidth = Math.max(200, Math.min(400, e.clientX));
        if (newWidth > 200 && newWidth < 500) {
          setSidebarWidth(newWidth);
        } else {
          setSidebarWidth(0);
        }
      }
    },
    [isResizing]
  );

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.userSelect = "";
  }, []);

  const resetSidebarWidth = () => setSidebarWidth(300);

  useEffect(() => {
    window.addEventListener("mousemove", resizeSidebar);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", resizeSidebar);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resizeSidebar, stopResizing]);

  return {
    sidebarWidth,
    setSidebarWidth,
    setIsResizing,
    memoizedRoutes,
    resetSidebarWidth,
  };
};

