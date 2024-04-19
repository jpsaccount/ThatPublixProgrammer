import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { useContext, useEffect, useRef, useState } from "react";
import { delay } from "@/sdk/utils/asyncUtils";
import { LiveChangeContext } from "@/contexts/LiveChangeContext";
import { isUsable } from "@/sdk/utils/usabilityUtils";

export default function useLiveChangesIndicator(value: any): [boolean, string] {
  const liveChangesContext = useContext(LiveChangeContext);

  const [showModifiedByName, setShowModifiedByName] = useState(false);
  const isMounted = useRef(false);
  const previousValue = useRef(null);

  useEffect(() => {
    if (isMounted.current === false) {
      delay(200).then((x) => {
        isMounted.current = true;
      });
      return;
    }
    if (isUsable(liveChangesContext) === false || liveChangesContext.isIndicated) return;
    previousValue.current = value;
    setShowModifiedByName(true);
    delay(isNullOrWhitespace(liveChangesContext?.lastModifiedUserName) ? 2000 : 1500).then((x) =>
      setShowModifiedByName(false),
    );
    liveChangesContext.setIsIndicated && liveChangesContext.setIsIndicated(true);
  }, [value]);

  return [showModifiedByName, liveChangesContext?.lastModifiedUserName];
}
