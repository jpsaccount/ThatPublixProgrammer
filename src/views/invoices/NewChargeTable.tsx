import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { ChargeTable } from "@/sdk/entities/billing/ChargeTable";
import { Invoice } from "@/sdk/entities/billing/Invoice";

import { useEffect, useState } from "react";

export default function NewChargeTable({ onCreate }: { onCreate: React.Dispatch<React.SetStateAction<Invoice>> }) {
  const [newChargeTable, setNewChargeTable] = useState<ChargeTable>(new ChargeTable());

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setNewChargeTable(new ChargeTable());
  }, [open]);

  const handleCreate = () => {
    onCreate((x) => {
      const newInvoice = { ...x, ChargeTables: [...x.ChargeTables, newChargeTable] };
      return newInvoice;
    });
    setOpen(false);
  };
  return (
    <PolModal
      onOpenChanged={(x) => setOpen(x)}
      isOpen={open}
      heading={"Create"}
      modalTrigger={
        <PolButton data-testid="new-charge-table-button" onClick={() => setOpen(true)} className="w-fit">
          New Charge Table
        </PolButton>
      }
    >
      <div className="mt-2 flex flex-col items-center space-y-4">
        <PolInput
          data-testid="header-input-inside-modal"
          label="Header"
          value={newChargeTable.Header}
          onValueChanged={(x) =>
            setNewChargeTable((prev) => {
              return { ...prev, Header: x };
            })
          }
        ></PolInput>
        <PolButton data-testid="create-button" onClick={handleCreate}>
          Create
        </PolButton>
      </div>
    </PolModal>
  );
}
