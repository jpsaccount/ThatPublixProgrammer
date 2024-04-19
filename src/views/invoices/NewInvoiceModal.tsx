import { PolButton } from "@/components/polComponents/PolButton";
import { PolDatePicker } from "@/components/polComponents/PolDatePicker";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import useDbCaching from "@/customHooks/sdkHooks/useDbCaching";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import { InvoiceStatus } from "@/sdk/enums/InvoiceStatus";
import moment from "moment";
import React, { useState } from "react";

interface Props {
  onInvoiceCreated: (invoice: Invoice) => void;
}

export default function NewInvoiceModal({ onInvoiceCreated }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const upsertMutation = useDbUpsert(Invoice);
  const navigate = usePolNavigate();

  const [value, setValue] = useState<Invoice>(() => {
    const initValue = new Invoice();

    initValue.Status = InvoiceStatus.Created;

    initValue.InvoiceTotal = 0;
    initValue.AmountPaid = 0;
    return initValue;
  });

  const handleChange = (newValue: Partial<Invoice>) => {
    setValue((prev) => {
      return { ...prev, ...newValue };
    });
  };

  const handleCreate = () => {
    setIsLoading(true);
    upsertMutation.mutateAsync(value).then(() => {
      navigate({ to: value.id });
      setIsLoading(false);
      onInvoiceCreated && onInvoiceCreated(value);
    });
  };

  return (
    <PolModal
      modalTrigger={
        <PolButton data-testid="addInvoiceButton" className=" ml-auto w-fit md:mb-0 md:ml-5">
          New Invoice
        </PolButton>
      }
      heading="New Invoice"
    >
      <div className="mt-3 flex flex-col items-center gap-3">
        <PolInput
          data-testid="invoice-number-input"
          label="Invoice Number"
          value={value.InvoiceNumber}
          onValueChanged={(x) => handleChange({ InvoiceNumber: x })}
        ></PolInput>
        <PolInput
          data-testid="internal-name-input"
          value={value.InternalName}
          onValueChanged={(x) => handleChange({ InternalName: x })}
          label="Internal Name"
        ></PolInput>
        <PolButton data-testid="create-button" className="w-fit" onClick={handleCreate} isLoading={isLoading}>
          Create
        </PolButton>
      </div>
    </PolModal>
  );
}
