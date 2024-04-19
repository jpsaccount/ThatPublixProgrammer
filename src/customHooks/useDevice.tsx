import React, { useMemo } from "react";
import useWindowDimensions from "./useWindowDimensions";
import { isPwaLaunched } from "@/utilities/deviceUtils";

export default function useDevice() {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const isPwa = isPwaLaunched();

  return useMemo(() => {
    return { isMobile, width, height, isPwa };
  }, [isMobile, width, height, isPwa]);
}
