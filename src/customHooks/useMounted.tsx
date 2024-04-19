import { useCallback, useEffect, useRef } from "react";

export default function useMounted(): () => boolean {
  const isMounted = useRef<boolean>(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback((): boolean => isMounted.current, []);
}
