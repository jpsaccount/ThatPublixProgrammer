import { isDevEnvironment } from "@/sdk/utils/devUtils";
import { isMouseEvent } from "@testing-library/user-event/dist/cjs/event/eventMap.js";
import React, { useEffect, useRef } from "react";

export default function useAfterMountedEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
  const isMounted = useRef(false);
  const strictModeFirstRun = useRef(true);

  useEffect(() => {
    if (isDevEnvironment() && strictModeFirstRun.current) {
      strictModeFirstRun.current = false;
      return;
    }

    if (isMounted.current) {
      effect();
    }
    isMounted.current = true;
  }, deps);
}
