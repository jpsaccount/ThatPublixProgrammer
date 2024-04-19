import { DbChangeLog } from "@/sdk/models/DbChangeLog";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useEffect, useState } from "react";
import { useAuth } from "./auth";

type OnLiveUpdateMethod<TEntity> = {
  onLiveUpdate: (action: (updates: Partial<TEntity>, changeLog: DbChangeLog) => any) => void;
};

export default function useLiveChangeTracking<TEntity>(
  request: OnLiveUpdateMethod<TEntity>,
  action?: (updates: Partial<TEntity>, changeLog: DbChangeLog) => any,
) {
  const [changeLog, setChangeLog] = useState<DbChangeLog>(null);

  useEffect(() => {
    request.onLiveUpdate((changes, changeLog) => {
      setChangeLog(changeLog);
    });
  }, [request.onLiveUpdate, setChangeLog]);

  useEffect(() => {
    if (isUsable(changeLog) && action) {
      action(changeLog.changes, changeLog);
    }
  }, [changeLog]);

  return changeLog;
}
