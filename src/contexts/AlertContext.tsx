import { ReactNode, createContext, useContext, useState } from "react";

export interface AlertProps {
  title: string;
  description: string;
  confirmTitle?: string;
  cancelTitle?: string;
}

class Context {
  showAlert: (props: AlertProps) => Promise<boolean>;
  hideAlert: () => void;
  alertState: AlertState = new AlertState();
}

class AlertState {
  isOpen: boolean = false;
  title: string;
  description: string;
  confirmTitle: string = "Confirm";
  cancelTitle: string = "Cancel";
  onConfirm: () => void;
  onCancel: () => void;
}

export const AlertContext = createContext(new Context());

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return { hideAlert: context.hideAlert, showAlert: context.showAlert };
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertState, setAlertState] = useState(new AlertState());

  async function showAlert({ title, description, confirmTitle, cancelTitle }: AlertProps): Promise<boolean> {
    const result = await new Promise<boolean>((resolve, reject) =>
      setAlertState({
        isOpen: true,
        title,
        description,
        confirmTitle,
        cancelTitle,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      }),
    );
    return result;
  }

  const hideAlert = () => {
    setAlertState({ ...alertState, isOpen: false });
  };

  return <AlertContext.Provider value={{ alertState, showAlert, hideAlert }}>{children}</AlertContext.Provider>;
};
