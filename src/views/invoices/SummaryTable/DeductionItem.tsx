import { LabelSection } from "@/components/LabelSection/LabelSection";
import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolText from "@/components/polComponents/PolText";
import useAutosaveState from "@/customHooks/sdkHooks/useEntityAutosave";
import { RetainageItem } from "@/sdk/entities/billing/RetainageItems";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { useEffect } from "react";
import DeductionUpdateModal from "../modals/DeductionUpdateModal";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { Invoice } from "@/sdk/entities/billing/Invoice";

export function DeductionItem({
  retainageItem,
  workingPhases,
  onDelete,
  invoice,
}: {
  retainageItem: RetainageItem;
  workingPhases: WorkingPhase[];
  onDelete: (id: string) => any;
  invoice: Invoice;
}) {
  const [value, update, isSaving, setValue] = useAutosaveState(RetainageItem, () => new RetainageItem());

  useEffect(() => {
    setValue((pre) => {
      return retainageItem;
    });
  }, [retainageItem]);

  useEffect(() => {
    if (value.IsPercentageOfInvoiceTotal && invoice.Subtotal > -1 && value.Rate > -1) {
      const newAmount = value.Rate * 0.01 * invoice.Subtotal;
      if (value.AmountUsdRetained !== newAmount) {
        update({ ...value, AmountUsdRetained: newAmount, AmountUsd: newAmount * -1 });
      }
    } else {
      if (value.Rate != value.AmountUsdRetained)
        update({ ...value, AmountUsdRetained: value.Rate, AmountUsd: value.Rate * -1 });
    }
  }, [value.IsPercentageOfInvoiceTotal, value.Rate, invoice]);

  return (
    <div
      key={value.id}
      className="grid grid-flow-col grid-cols-[auto_130px_200px_200px_1fr_150px_150px_50px] border-t p-2"
    >
      <DeductionUpdateModal
        retainageItem={value}
        update={update}
        modalTrigger={
          <PolButton variant="ghost">
            <PolIcon name="PenLine"></PolIcon>
          </PolButton>
        }
      ></DeductionUpdateModal>
      <div></div>
      <LabelSection label="Working Phase">
        <PolText data-testid={`working-phase-${value.Title}`}>
          {workingPhases.find((x) => x.id === value.WorkingPhaseId)?.DisplayName}
        </PolText>
      </LabelSection>
      <LabelSection label="Title">
        <PolText data-testid={`title-${value.Title}`}>{value.Title}</PolText>
      </LabelSection>
      <LabelSection label="Description">
        <PolText data-testid={`description-${value.Title}`}>{value.Description}</PolText>
      </LabelSection>
      <LabelSection label="Amount">
        <PolText data-testid={`percentage-${value.Title}`}>
          {value.IsPercentageOfInvoiceTotal ? value.Rate + "%" : toUsdString(value.Rate)}
        </PolText>
      </LabelSection>
      <LabelSection className="" label="Amount">
        <PolText data-testid={`amount-${value.Title}`}>{toUsdString(value.AmountUsd)}</PolText>
      </LabelSection>
      <PolButton
        data-testid={`delete-${value.Title}`}
        className="px-4"
        variant="ghost"
        onClick={() => onDelete(value.id)}
      >
        <PolIcon name="ListX"></PolIcon>
      </PolButton>
    </div>
  );
}
