import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolHeading from "@/components/polComponents/PolHeading";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import PolText from "@/components/polComponents/PolText";
import { RetainageItem } from "@/sdk/entities/billing/RetainageItems";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import React, { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { SelectedInvoiceContext } from "../contexts/SelectedInvoiceContext";

interface Props {
  retainageItem?: RetainageItem;
  update: (x: RetainageItem) => void;
  modalTrigger: ReactNode;
}

export default function DeductionUpdateModal({ retainageItem, update, modalTrigger }: Props) {
  const [open, setOpen] = useState(false);

  const { workingPhases } = useContext(SelectedInvoiceContext);
  const [newValue, setNewValue] = useState(new RetainageItem());

  const handleChange = (newProps: Partial<RetainageItem>) => {
    setNewValue({ ...newValue, ...newProps });
  };

  useEffect(() => {
    setNewValue(retainageItem ?? new RetainageItem());
  }, [open]);

  const handleSave = () => {
    update(newValue);
    setOpen(false);
  };

  return (
    <>
      <PolModal
        isOpen={open}
        onOpenChanged={setOpen}
        modalTrigger={modalTrigger}
        heading={<PolHeading size={2}>Retainage Item</PolHeading>}
      >
        <div className="grid grid-flow-row space-y-5 p-2">
          <div className="grid grid-flow-col space-x-5">
            <PolInput
              data-testid="title-input"
              label="Title"
              onValueChanged={(x) => handleChange({ Title: x })}
              value={newValue.Title}
            ></PolInput>
            <PolInput
              data-testid="description-input"
              label="Description"
              onValueChanged={(x) => handleChange({ Description: x })}
              value={newValue.Description}
            ></PolInput>
          </div>
          <PolEntityDropdown
            data-testid="working-phase-dropdown"
            nameGetter={(x) => x.DisplayName}
            label="Working Phase"
            options={workingPhases}
            onValueChanged={(x) => handleChange({ WorkingPhaseId: x.id })}
            selectedId={newValue.WorkingPhaseId}
          ></PolEntityDropdown>
          <div className="grid grid-flow-col space-x-5">
            <PolInput
              data-testid="retainage-input"
              label="Amount Retainaged"
              onValueChanged={(x) => handleChange({ Rate: x })}
              value={newValue.Rate}
              type="number"
            ></PolInput>
            <PolCheckbox
              data-testid="is-percentage-checkbox"
              className="mt-auto"
              value={newValue.IsPercentageOfInvoiceTotal}
              onValueChanged={(x) => handleChange({ IsPercentageOfInvoiceTotal: x })}
            >
              Is Percentage of subtotal
            </PolCheckbox>
          </div>

          <PolButton data-testid="save-button" onClick={handleSave}>
            Save
          </PolButton>
        </div>
      </PolModal>
    </>
  );
}
