import { ReactNode, createContext } from "react";

class Context {
  trigger: "change" | "blur" | number;
}

export const OnValueChangedTriggerContext = createContext(new Context());

export const OnValueChangedTriggerContextProvider = ({
  children,
  trigger,
}: {
  children: ReactNode;
  trigger: "change" | "blur" | number;
}) => {
  return (
    <OnValueChangedTriggerContext.Provider
      value={{
        trigger: trigger,
      }}
    >
      {children}
    </OnValueChangedTriggerContext.Provider>
  );
};
