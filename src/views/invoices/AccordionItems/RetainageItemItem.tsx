import { LabelSection } from "@/components/LabelSection/LabelSection";
import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import PolTable from "@/components/polComponents/PolTable";
import PolTableCell from "@/components/polComponents/PolTableCell";
import PolTableRow from "@/components/polComponents/PolTableRow";
import PolText from "@/components/polComponents/PolText";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { RetainageItem } from "@/sdk/entities/billing/RetainageItems";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { useContext } from "react";
import { SelectedInvoiceContext } from "../contexts/SelectedInvoiceContext";

export function RetainageItemItem({ onDelete, id }: { id: string; onDelete: (id: string) => void }) {
  const request = useDbQueryFirst(RetainageItem, `WHERE c.id = "${id}"`);
  const { workingPhases } = useContext(SelectedInvoiceContext);

  return (
    <PolRequestPresenter
      request={request}
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
        </PolTableRow>
      )}
      onSuccess={() => (
        <PolTableRow>
          <PolTableCell>
            <PolText>{request.data.CreatedDateTime.format("MM-DD-YYYY")}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText>{workingPhases.find((x) => x.id === request.data.WorkingPhaseId)?.DisplayName}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText>{request.data.Title}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText>{request.data.Description}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText>{toUsdString(request.data.AmountUsd)}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText>{toUsdString(request.data.AmountUsdRetained)}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolButton variant="ghost" onClick={() => onDelete(id)}>
              <PolIcon name="ListX"></PolIcon>
            </PolButton>
          </PolTableCell>
        </PolTableRow>
      )}
    ></PolRequestPresenter>
  );
}
