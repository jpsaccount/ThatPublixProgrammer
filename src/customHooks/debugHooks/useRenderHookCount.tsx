import { useState, useEffect } from "react";

const useRenderHookCount = (hook) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount((prevCount) => prevCount + 1);
  }, [hook]);

  return count;
};

export default useRenderHookCount;
