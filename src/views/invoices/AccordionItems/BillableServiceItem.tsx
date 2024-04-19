import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import PolTableCell from "@/components/polComponents/PolTableCell";
import PolTableRow from "@/components/polComponents/PolTableRow";
import PolText from "@/components/polComponents/PolText";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import useAutosaveState from "@/customHooks/sdkHooks/useEntityAutosave";
import { BillableService } from "@/sdk/entities/billing/BillableService";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { useContext, useEffect, useState } from "react";
import { SelectedInvoiceContext } from "../contexts/SelectedInvoiceContext";
import EditBillableServiceModal from "../modals/EditBillableServiceModal";

export function BillableServiceItem({
  id,
  onDelete,
}: {
  onDelete: (service: BillableService) => void | Promise<void>;
  id: string;
}) {
  const request = useDbQueryFirst(BillableService, `WHERE c.id = "${id}"`);
  const [value, update, saveMutation, setValue] = useAutosaveState(BillableService, new BillableService());
  const { workingPhases } = useContext(SelectedInvoiceContext);
  useEffect(() => {
    if (request.data) {
      setValue(request.data);
    }
  }, [request.data]);

  return (
    <PolRequestPresenter
      containerClassName="contents"
      onLoading={() => (
        <PolTableRow>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
        </PolTableRow>
      )}
      request={request}
      onFailure={() => <></>}
      onSuccess={() => (
        <PolTableRow>
          <PolTableCell>
            <UpdateServiceItem
              isLoading={saveMutation.isPending}
              service={value}
              update={update}
              workingPhases={workingPhases}
            ></UpdateServiceItem>
          </PolTableCell>
          <PolTableCell>
            <PolText className="text-center" data-testid={`service-date-${value.Description}`}>
              {value.ServiceDate.format("MM/DD/YYYY")}
            </PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText data-testid={`working-phase-${value.Description}`}>
              {workingPhases.find((x) => x.id === value.WorkingPhaseId)?.DisplayName}
            </PolText>
          </PolTableCell>

          <PolTableCell>
            <PolText data-testid={`description-${value.Description}`}>{value.Description}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText data-testid={`quantity-${value.Description}`} className="w-full text-center">
              {value.Quantity}
            </PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText data-testid={`rate-${value.Description}`} className="w-full text-right">
              {toUsdString(value.Rate)}
            </PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText className="w-full text-right">{toUsdString(value.Rate * value.Quantity)}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolButton variant="ghost" onClick={() => onDelete(value)}>
              <PolIcon name="ListX"></PolIcon>
            </PolButton>
          </PolTableCell>
        </PolTableRow>
      )}
    ></PolRequestPresenter>
  );
}

const UpdateServiceItem = ({
  isLoading,
  update,
  service,
  workingPhases,
}: {
  isLoading?: boolean;
  update: React.Dispatch<React.SetStateAction<BillableService>>;
  service: BillableService;
  workingPhases: WorkingPhase[];
}) => {
  const [serviceState, setServiceState] = useState(service);

  useEffect(() => {
    setServiceState(service);
  }, [service]);

  const handleSave = (value: BillableService) => {
    update({ ...value });
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  return (
    <EditBillableServiceModal
      headingText="Update Billable Service"
      service={serviceState}
      onCommit={handleSave}
      modalTrigger={
        <PolButton onClick={() => setOpen(false)} variant="ghost" className="w-fit">
          <PolIcon
            name="PenLine"
            data-testid={`udpate-button-${service.Description}`}
            className="cursor-pointer"
          ></PolIcon>
        </PolButton>
      }
    />
  );
};
