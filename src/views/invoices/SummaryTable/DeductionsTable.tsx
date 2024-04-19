import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import { DeductionItem } from "./DeductionItem";
import { RetainageItem } from "@/sdk/entities/billing/RetainageItems";
import { useContext } from "react";
import { SelectedInvoiceContext } from "../contexts/SelectedInvoiceContext";

export function DeductionsTable({
  isOpen,
  onOpenChange,
  retainageItems,
}: {
  isOpen: boolean;
  onOpenChange: (x: boolean) => void;
  retainageItems: RetainageItem[];
}) {
  const invoiceUpdate = useDbUpsert(Invoice);
  const { invoice, workingPhases } = useContext(SelectedInvoiceContext);

  const handleDelete = async (id: string) => {
    const newInvoice = { ...invoice };

    const newRetainageItems = invoice.SummaryTable.RetainageItems.filter((x) => x !== id);

    newInvoice.SummaryTable.RetainageItems = newRetainageItems;

    await invoiceUpdate.mutateAsync(newInvoice);
  };

  return (
    <>
      {retainageItems.length !== 0 &&
        retainageItems.map((x) => (
          <DeductionItem
            key={x.id}
            invoice={invoice}
            onDelete={handleDelete}
            retainageItem={x}
            workingPhases={workingPhases}
          ></DeductionItem>
        ))}
    </>
  );
}
