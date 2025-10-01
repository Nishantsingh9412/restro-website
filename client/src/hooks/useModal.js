// hooks/useDisclosureWithOutsideClick.tsx
import { useCallback, useEffect, useRef, useState } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setTimeout(onClose, 100); // Delay to allow click event to propagate
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return { isOpen, onOpen, onClose, onToggle, ref };
}
