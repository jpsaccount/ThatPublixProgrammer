import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import { CardContent, CardHeader } from "@/components/ui/card";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { InvoiceSummaryTable } from "@/sdk/childEntities/InvoiceSummaryTable";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import { RetainageItem } from "@/sdk/entities/billing/RetainageItems";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { useContext, useEffect, useState } from "react";
import { DeductionsTable } from "./DeductionsTable";
import PolInput from "@/components/polComponents/PolInput";
import useAutosaveState from "@/customHooks/sdkHooks/useEntityAutosave";
import PolText from "@/components/polComponents/PolText";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { PolRequestErrorPresenter } from "@/components/polComponents/PolRequestErrorPresenter";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { tryGetSum } from "@/sdk/utils/arrayUtils";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import DeductionUpdateModal from "../modals/DeductionUpdateModal";
import { SelectedInvoiceContext } from "../contexts/SelectedInvoiceContext";

export function DeductionsSection() {
  const [isShown, setIsShown] = useState(false);

  const invoiceUpsert = useDbUpsert(Invoice);
  const retainageItemUpsert = useDbUpsert(RetainageItem);

  const { invoice, update } = useContext(SelectedInvoiceContext);

  const retainageItemsRequest = useDbQuery(
    RetainageItem,
    `WHERE c.id IN ["${invoice.SummaryTable.RetainageItems.join(",")}"]`,
  );

  const handleAddRetainageItem = (newItem: RetainageItem) => {
    const updatedInvoice: Invoice = {
      ...invoice,
      SummaryTable: { ...invoice.SummaryTable, RetainageItems: [...invoice.SummaryTable.RetainageItems, newItem.id] },
    };

    return retainageItemUpsert.mutateAsync(newItem).then(() => {
      invoiceUpsert.mutateAsync(updatedInvoice);
    });
  };

  return (
    <>
      <PolRequestPresenter
        request={retainageItemsRequest}
        onLoading={() => (
          <div className="grid grid-flow-row">
            <PolSkeleton className="h-16 rounded-none border-t" />
            <PolSkeleton className="h-16 rounded-none border-t" />
            <PolSkeleton className="h-16 rounded-none border-t" />
          </div>
        )}
        onSuccess={() => (
          <>
            <DeductionsTable
              retainageItems={retainageItemsRequest.data}
              isOpen={isShown}
              onOpenChange={setIsShown}
            ></DeductionsTable>
            <hr />

            <div className="mr-2 grid grid-flow-col grid-cols-[1fr_auto] p-4">
              <PolInput
                className="w-96"
                data-testid="memo-input"
                isMultiline={true}
                label="Memo"
                value={invoice.Memo}
                onValueChanged={(x) => update({ Memo: x })}
              ></PolInput>

              <div className="flex flex-col">
                <div className="flex flex-row space-x-2">
                  <DeductionUpdateModal
                    modalTrigger={
                      <PolButton
                        tooltip="New deduction"
                        variant="ghost"
                        className="ml-auto mt-0 h-fit w-fit p-0"
                        data-testid="add-deduction-button"
                      >
                        <PolIcon name="Plus" />
                      </PolButton>
                    }
                    update={handleAddRetainageItem}
                  />
                  <PolText type="bold">Adjustments: </PolText>
                  <PolText>{toUsdString(invoice.InvoiceTotal - invoice.Subtotal)}</PolText>
                </div>
                <div className=" ml-auto flex flex-row space-x-2">
                  <PolText type="bold">Total: </PolText>
                  <PolText>{toUsdString(invoice.InvoiceTotal)}</PolText>
                </div>
              </div>
            </div>
          </>
        )}
      ></PolRequestPresenter>
    </>
  );
}
