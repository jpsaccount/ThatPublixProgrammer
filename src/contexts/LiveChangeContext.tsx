import { useAuth } from "@/customHooks/auth";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { User } from "@/sdk/entities/core/User";
import { DbChangeLog } from "@/sdk/models/DbChangeLog";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Moment } from "moment";
import { ReactNode, createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

export interface AlertProps {
  title: string;
  description: string;
}

class Context {
  lastModifiedUserName: string;
  changeLog: DbChangeLog;
  isIndicated: boolean;
  setIsIndicated: React.Dispatch<React.SetStateAction<boolean>>;
}

class AlertState {
  isOpen: boolean = false;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LiveChangeContext = createContext(new Context());

export const LiveChangeContextProvider = ({ children, changeLog }: { children: ReactNode; changeLog: DbChangeLog }) => {
  const { user } = useAuth();

  const isIndicated = useRef(false);

  useLayoutEffect(() => {
    isIndicated.current = false;
  }, [changeLog]);

  const userRequest = useDbQueryFirst(User, `WHERE c.id = "${changeLog?.modifiedByUserId}"`, {
    enabled: isUsable(changeLog?.modifiedByUserId),
  });
  return (
    <LiveChangeContext.Provider
      value={{
        isIndicated: isIndicated.current,
        setIsIndicated: (value: boolean) => (isIndicated.current = value),
        changeLog: changeLog,
        lastModifiedUserName: user?.id === changeLog?.modifiedByUserId ? "" : getFullName(userRequest.data?.Person),
      }}
    >
      {children}
    </LiveChangeContext.Provider>
  );
};
