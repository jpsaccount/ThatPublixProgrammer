import { PolButton } from "@/components/polComponents/PolButton";
import { PolDatePicker } from "@/components/polComponents/PolDatePicker";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolHeading from "@/components/polComponents/PolHeading";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import { BillableService } from "@/sdk/entities/billing/BillableService";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { PhaseBillingType } from "@/sdk/enums/PhaseBillingType";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { SelectedInvoiceContext } from "../contexts/SelectedInvoiceContext";

interface Props {
  service?: BillableService;
  onCommit: (service: BillableService) => void;
  modalTrigger: ReactNode;
  headingText: string;
}

export default function EditBillableServiceModal({ headingText, onCommit, service, modalTrigger }: Props) {
  const [open, setOpen] = useState(false);
  const [serviceState, setServiceState] = useState(new BillableService());

  const { workingPhases } = useContext(SelectedInvoiceContext);

  useEffect(() => {
    if (service) {
      setServiceState(service);
    } else if (open) {
      setServiceState(new BillableService());
    }
  }, [service, open]);

  const billableWorkingPhases = useMemo(
    () => workingPhases.filter((x) => x.PhaseBillingType === PhaseBillingType.LumpSum),
    [workingPhases],
  );

  const isReadyToAdd = useMemo(() => {
    return (
      isUsable(serviceState.ServiceDate) &&
      isUsable(serviceState.WorkingPhaseId) &&
      isUsable(serviceState.Description) &&
      isUsable(serviceState.Quantity) &&
      isUsable(serviceState.Rate)
    );
  }, [
    serviceState.ServiceDate,
    serviceState.Description,
    serviceState.WorkingPhaseId,
    serviceState.Quantity,
    serviceState.Rate,
  ]);

  const handleAdd = () => {
    onCommit(serviceState);
    setOpen(false);
  };

  return (
    <PolModal
      onOpenChanged={setOpen}
      isOpen={open}
      heading={<PolHeading size={4}>{headingText}</PolHeading>}
      modalTrigger={modalTrigger}
    >
      <div className=" grid w-[100dvw] grid-flow-row gap-3 md:w-[50dvw] lg:w-[25dvw]">
        <div className="grid grid-flow-col grid-cols-[1fr_3fr] space-x-5">
          <PolDatePicker
            label="Service Date"
            value={serviceState.ServiceDate}
            onValueChanged={(x) =>
              setServiceState((prev) => {
                return { ...prev, ServiceDate: x };
              })
            }
          ></PolDatePicker>
          <PolEntityDropdown
            data-testid="working-phase-dropdown"
            nameGetter={(x) => x.DisplayName}
            onValueChanged={(x) =>
              setServiceState((prev) => {
                return { ...prev, WorkingPhaseId: x.id };
              })
            }
            options={billableWorkingPhases}
            selectedId={serviceState.WorkingPhaseId}
            label="Working Phase"
          ></PolEntityDropdown>
        </div>
        <PolInput
          data-testid="title-input"
          label="Title"
          onValueChanged={(x) =>
            setServiceState((prev) => {
              return { ...prev, Title: x };
            })
          }
          value={serviceState.Title}
        ></PolInput>
        <PolInput
          data-testid="description-input"
          label="Description"
          onValueChanged={(x) =>
            setServiceState((prev) => {
              return { ...prev, Description: x };
            })
          }
          value={serviceState.Description}
        ></PolInput>
        <div className="grid grid-flow-col grid-cols-[1fr_3fr] space-x-5">
          <PolInput
            data-testid="quantity-input"
            type="number"
            label="Quantity"
            value={serviceState.Quantity}
            onValueChanged={(x) =>
              setServiceState((prev) => {
                return { ...prev, Quantity: x };
              })
            }
          ></PolInput>
          <PolInput
            data-testid="rate-input"
            label="Rate"
            type="number"
            value={serviceState.Rate}
            onValueChanged={(x) =>
              setServiceState((prev) => {
                return { ...prev, Rate: x };
              })
            }
          ></PolInput>
        </div>
        <PolButton data-testid="save-button" disabled={!isReadyToAdd} onClick={handleAdd} className="mt-5">
          Save
        </PolButton>
      </div>
    </PolModal>
  );
}
