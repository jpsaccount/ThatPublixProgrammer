import EntityImageManager from "@/components/EntityImageManager";
import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolDropdown } from "@/components/polComponents/PolDropdown";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolInput from "@/components/polComponents/PolInput";
import PolMutationErrorPresenter from "@/components/polComponents/PolMutationErrorPresenter";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDbAttachmentUpload } from "@/customHooks/sdkHooks/useDbAttachmentUpload";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import useDevice from "@/customHooks/useDevice";
import { useLocalStorageState } from "@/customHooks/useLocalStorageState";
import { ContentQuality, ContentType } from "@/sdk/contracts/Entity";
import { Currency } from "@/sdk/entities/billing/Currency";
import { CurrencyConversation } from "@/sdk/entities/billing/CurrencyConversation";
import { Expense } from "@/sdk/entities/billing/Expense";
import { GlobalExpenseReport } from "@/sdk/entities/billing/GlobalExpenseReport";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { BillingStatus } from "@/sdk/enums/BillingStatus";
import { isOnInvoice } from "@/sdk/utils/billingStatusUtils";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useEffect, useState } from "react";
import ExpenseLineItems from "./ExpenseLineItems";
import { tryGetSum } from "@/sdk/utils/arrayUtils";
import { LabelSection } from "@/components/LabelSection/LabelSection";

interface Props {
  expense: Expense;
  globalExpenseReport: GlobalExpenseReport;
  onSave?: () => void;
}

const ExpenseDetailView = ({ expense: initialValue, globalExpenseReport, onSave }: Props) => {
  const [value, setValue] = useState<Expense>(isUsable(initialValue) ? initialValue : new Expense());

  function update(newVal: Partial<Expense>) {
    setValue((x) => ({ ...x, ...newVal }));
  }

  useEffect(() => {
    setValue(initialValue ?? new Expense());
  }, [initialValue]);

  const workingPhaseRequest = useDbQuery(
    WorkingPhase,
    `WHERE c.ProjectId = "${globalExpenseReport?.ProjectId}" AND c.PhaseBillingType = 4`,
    { enabled: isUsable(globalExpenseReport) },
  );
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

  const mutation = useDbUpsert(Expense);
  const uploadMutation = useDbAttachmentUpload(Expense);
  const currencyRequest = useDbQuery(Currency);
  const currencyRateRequest = useDbQueryFirst(
    CurrencyConversation,
    `WHERE c.CurrencyId = "${value.CurrencyId}" AND c.Date = "${value.TxnDate?.format("YYYY-MM-DD")}" `,
    { enabled: value.CurrencyId != "1" && value.TxnDate != null },
  );

  value.CurrencyRateToUsd = currencyRateRequest.data?.RateToUsd ?? 0;
  if (value.CurrencyId == "1") value.CurrencyRateToUsd = 1;

  function getCurrencyRate() {
    if (value.CurrencyId == "1") return "";
    if (currencyRateRequest.isFetching) return " (...)";
    if (value.CurrencyId) {
      return ` (${toUsdString(value.CurrencyRateToUsd)})`;
    }
    return "";
  }

  async function save() {
    const promises: Promise<any>[] = [mutation.mutateAsync(value)];
    if (uploadedFiles !== null) {
      promises.push(uploadMutation.mutateAsync([value, uploadedFiles[0]]));
    }
    await Promise.all(promises);
    onSave && onSave();
    setUploadedFiles(null);
  }
  const settableValues = [
    { label: "Billable", value: BillingStatus.Billable },
    { label: "Not Billable", value: BillingStatus.NotBillable },
  ];
  const allValues = [
    { label: "Billable", value: BillingStatus.Billable },
    { label: "Not Billable", value: BillingStatus.NotBillable },
    { label: "On Invoice", value: BillingStatus.AddedToInvoice },
    { label: "Billed Elsewhere", value: BillingStatus.BilledElsewhere },
    { label: "Has been billed", value: BillingStatus.HasBeenBilled },
    { label: "Lump Sum", value: BillingStatus.LumpSum },
  ];

  const device = useDevice();

  const [viewingColumns, setViewingColumns] = useLocalStorageState("viewExpenseColumns", false);

  var detailComponent = (
    <ScrollArea
      className="h-[100dvh] md:h-fit"
      containerClassName="px-0 overflow-x-hidden md:max-h-[80dvh] max-h-[95dvh]"
    >
      <div className="grid-auto-row grid gap-5 pb-5">
        {viewingColumns === false && (
          <div>
            {device.isMobile === false && (
              <PolButton variant="ghost" title="Expand image" onClick={() => setViewingColumns(true)}>
                <PolIcon name="PanelRightOpen" stroke="var(--primary-500)" />
              </PolButton>
            )}
            <div className="mt-2">
              <EntityImageManager
                showPreview={false}
                uploadAttachmentContent={<PolButton>Upload your attachment...</PolButton>}
                currentFile={uploadedFiles ? uploadedFiles[0] : null}
                uploaderClassName="mt-auto"
                downloadable={true}
                downloadFileName={value.TxnDate?.format("MM-DD-YYYY") ?? "Unknown Date" + " - " + value.MerchantName}
                className=" m-auto"
                entity={value}
                quality={ContentQuality.LightlyCompressed}
                onUpload={setUploadedFiles}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="col-span-[1fr_auto] flex flex-row flex-wrap gap-2">
            <PolInput
              data-testid="merchantNameInput"
              containerClassName="flex-grow"
              label="Merchant Name"
              value={value.MerchantName}
              onValueChanged={(e) => update({ MerchantName: e })}
            ></PolInput>
            <PolInput
              label="Transaction Date"
              type="date"
              value={value.TxnDate}
              onValueChanged={(e) => update({ TxnDate: e })}
            ></PolInput>
          </div>
          <div className="grid grid-flow-col gap-2">
            {isNullOrWhitespace(globalExpenseReport?.ProjectId) == false && (
              <PolRequestPresenter
                request={workingPhaseRequest}
                onLoading={() => <PolSkeleton className="h-10" />}
                onSuccess={() => (
                  <PolEntityDropdown
                    isSearchable={false}
                    containerClassName="w-full"
                    onValueChanged={(e) => update({ WorkingPhaseId: e.id })}
                    options={workingPhaseRequest.data}
                    nameGetter={(x) => x.DisplayName}
                    label="Working Phase"
                    selectedId={value.WorkingPhaseId}
                  ></PolEntityDropdown>
                )}
              ></PolRequestPresenter>
            )}
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            <PolDropdown
              isSearchable={false}
              isDisabled={isOnInvoice(value.BillingDetails.Status)}
              containerClassName="flex-grow"
              placeHolder="Select"
              nameGetter={(x) => x.label}
              options={isOnInvoice(value.BillingDetails.Status) ? allValues : settableValues}
              label="Billing Status"
              value={
                allValues.find((i) => i.value === value.BillingDetails.Status) ?? {
                  label: BillingStatus[value.BillingDetails.Status],
                  value: value.BillingDetails.Status,
                }
              }
              onValueChanged={(x) => update({ BillingDetails: { ...value.BillingDetails, Status: x.value } })}
            ></PolDropdown>
            <PolEntityDropdown
              isSearchable={false}
              containerClassName="flex-grow"
              placeHolder="Select"
              selectedId={value.CurrencyId}
              onValueChanged={(e) => update({ CurrencyId: e.id })}
              options={currencyRequest.data}
              nameGetter={(x) => x.Symbol}
              label={"Currency" + getCurrencyRate()}
            />
          </div>

          {value.AttachmentMetadata.HasAttachment && value.AttachmentMetadata.ContentType == ContentType.PDF && (
            <LabelSection label="Print Settings" className="text-center">
              <div className="flex flex-row flex-wrap gap-2">
                <PolInput
                  containerClassName="flex-grow"
                  type="number"
                  label="Start"
                  value={value.PrintSetting.PrintStartPage}
                  onValueChanged={(e) => {
                    setValue((x) => ({ ...x, PrintSetting: { ...x.PrintSetting, PrintStartPage: e } }));
                  }}
                ></PolInput>
                <PolInput
                  label="End"
                  type="number"
                  value={value.PrintSetting.PrintEndPage}
                  onValueChanged={(e) => {
                    setValue((x) => ({ ...x, PrintSetting: { ...x.PrintSetting, PrintEndPage: e } }));
                  }}
                ></PolInput>
              </div>
            </LabelSection>
          )}
        </div>
        <hr className="w-full"></hr>

        <ExpenseLineItems onChange={(e) => update({ LineItems: e })} lineItems={value.LineItems}></ExpenseLineItems>
        <div className="grid grid-flow-col grid-cols-[1fr_auto_auto] space-x-2">
          <span></span>
          <span>Total:</span>
          <PolRequestPresenter
            showWhenPending={true}
            request={currencyRateRequest}
            onSuccess={() => (
              <span>{toUsdString(tryGetSum(value.LineItems.map((x) => x.Amount * value.CurrencyRateToUsd)))}</span>
            )}
            onFailure={() => (
              <span>{toUsdString(tryGetSum(value.LineItems.map((x) => x.Amount * value.CurrencyRateToUsd)))}</span>
            )}
            onLoading={() => <PolSkeleton className="h-5 w-12" />}
          />
        </div>

        <PolMutationErrorPresenter mutation={[uploadMutation, mutation]} />
        <PolButton onClick={save} className="mb-6">
          Save
        </PolButton>
      </div>
    </ScrollArea>
  );
  if (viewingColumns === false) {
    return detailComponent;
  } else {
    return (
      <div className="grid grid-flow-col grid-cols-2">
        <div>
          <PolButton variant="ghost" title="Collapse image" onClick={() => setViewingColumns(false)}>
            <PolIcon name="PanelRightClose" stroke="var(--primary-500)" />
          </PolButton>
          <EntityImageManager
            key={"preview"}
            currentFile={uploadedFiles ? uploadedFiles[0] : null}
            uploaderClassName="mt-auto mx-10"
            viewerClassName=" max-w-[30dvw] max-h-[50dvh]"
            downloadable={true}
            downloadFileName={value.TxnDate?.format("MM-DD-YYYY") ?? "Unknown Date" + " - " + value.MerchantName}
            className=" m-auto mx-10"
            entity={value}
            quality={ContentQuality.LightlyCompressed}
            onUpload={setUploadedFiles}
          />
        </div>
        {detailComponent}
      </div>
    );
  }
};

export default ExpenseDetailView;
