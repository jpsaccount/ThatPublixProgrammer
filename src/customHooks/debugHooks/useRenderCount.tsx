import { useEffect, useRef, useState } from "react";

const useRenderCount = (): number => {
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;
  });

  return renderCountRef.current;
};

export default useRenderCount;
