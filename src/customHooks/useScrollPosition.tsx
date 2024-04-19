import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useState, useEffect, RefObject, useMemo } from "react";

const useScrollPosition = (elementRef?: RefObject<HTMLElement>) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollHeight, setHeight] = useState(0);

  useEffect(() => {
    if (isUsable(elementRef)) {
      const element = elementRef.current;
      if (element === null) return;

      const handleScroll = () => {
        const newScrollPosition = element.scrollTop;
        setScrollY(newScrollPosition);
        setHeight(element.scrollHeight);
      };

      element.addEventListener("scroll", handleScroll);

      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    } else {
      const handleScroll = () => {
        setScrollY(window.scrollY);
        setHeight(document.body.scrollHeight - window.innerHeight);
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [elementRef]);

  return useMemo(() => {
    return { scrollY, scrollHeight };
  }, [scrollY, scrollHeight]);
};

export default useScrollPosition;
