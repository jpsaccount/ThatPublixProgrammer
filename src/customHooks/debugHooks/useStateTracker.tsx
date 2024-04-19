import { isDev, isDevEnvironment } from "@/sdk/utils/devUtils";
import { useState, useEffect } from "react";

export default function useStateTracker<T>(state: T) {
  if (isDevEnvironment() === false) {
    return;
  }
  useEffect(() => {
    console.log("State changed:", state);
  }, [state]);

  return;
}
