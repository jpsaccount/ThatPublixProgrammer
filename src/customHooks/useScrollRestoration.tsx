import { isUsable } from "@/sdk/utils/usabilityUtils";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";

export function useScrollRestoration(scrollAreaId?: string, ref?: React.RefObject<any>): number {
  const key = `sp-${scrollAreaId}`;

  const item = ref ? ref.current : window;
  const [savedPosition] = useState(() => parseInt(sessionStorage.getItem(key)));

  const saveScrollPosition = useCallback(
    debounce(() => {
      if (item !== window) {
        sessionStorage.setItem(key, item.scrollTop.toString());
      } else {
        sessionStorage.setItem(key, window.scrollY.toString());
      }
    }, 200),
    [ref, scrollAreaId],
  );

  useEffect(() => {
    if (savedPosition && item) {
      if (item !== window) {
        item.scrollTop = savedPosition;
      } else {
        window.scrollTo(0, savedPosition);
      }
    }
  }, [ref]);

  useEffect(() => {
    if (isUsable(scrollAreaId) === false || scrollAreaId === "" || item === null) return;
    item.addEventListener("scroll", saveScrollPosition);

    return () => {
      item?.removeEventListener("scroll", saveScrollPosition);
    };
  }, [ref, scrollAreaId]);
  return savedPosition;
}
