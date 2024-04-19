import { Invoice } from "@/sdk/entities/billing/Invoice";
import { Project } from "@/sdk/entities/project/Project";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { AlertProps } from "flowbite-react";
import { ReactNode, createContext, useCallback, useState } from "react";

class SelectedInvoiceContextState {
  invoice: Invoice;
  update: (invoiceUpdates: Partial<Invoice> | ((invoice: Invoice) => Invoice)) => any;
  project: Project;
  workingPhases: WorkingPhase[] = [];
}
export const SelectedInvoiceContext = createContext(new SelectedInvoiceContextState());

interface InvoiceProviderProps {
  children: ReactNode;
  invoice: Invoice;
  update: React.Dispatch<React.SetStateAction<Invoice>>;
  project: Project;
  workingPhases: WorkingPhase[];
}

const isPartialInvoice = (
  input: Partial<Invoice> | React.Dispatch<React.SetStateAction<Invoice>>,
): input is Partial<Invoice> => {
  return typeof input !== "function";
};

const isReactDispatch = (
  input: Partial<Invoice> | React.Dispatch<React.SetStateAction<Invoice>>,
): input is React.Dispatch<React.SetStateAction<Invoice>> => {
  return typeof input === "function";
};

export function SelectedInvoiceContextProvider({
  children,
  invoice,
  update,
  project,
  workingPhases,
}: InvoiceProviderProps) {
  const partialUpdate = useCallback(
    (invoiceUpdates: Partial<Invoice> | ((invoice: Invoice) => Invoice)) => {
      if (isPartialInvoice(invoiceUpdates)) {
        update((pre) => ({ ...pre, ...invoiceUpdates }));
      } else if (isReactDispatch(invoiceUpdates)) {
        update((pre) => invoiceUpdates(pre));
      }
    },
    [invoice, update],
  );

  return (
    <SelectedInvoiceContext.Provider value={{ invoice, project, update: partialUpdate, workingPhases }}>
      {children}
    </SelectedInvoiceContext.Provider>
  );
}
