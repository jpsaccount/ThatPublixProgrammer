import { LabelSection } from "@/components/LabelSection/LabelSection";
import PolIcon from "@/components/PolIcon";
import SavingIndicator from "@/components/indicator/SavingIndicator";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import PolInput from "@/components/polComponents/PolInput";
import PolLoadingSection from "@/components/polComponents/PolLoadingSection";
import PolMutationErrorPresenter from "@/components/polComponents/PolMutationErrorPresenter";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import PolTable from "@/components/polComponents/PolTable";
import PolTableCell from "@/components/polComponents/PolTableCell";
import PolTableHeader from "@/components/polComponents/PolTableHeader";
import PolText from "@/components/polComponents/PolText";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import useAutosaveState from "@/customHooks/sdkHooks/useEntityAutosave";
import { BillableService } from "@/sdk/entities/billing/BillableService";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import { Project } from "@/sdk/entities/project/Project";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";
import { BillableServiceItem } from "./AccordionItems/BillableServiceItem";
import { ExpenseItem } from "./AccordionItems/ExpenseItem";
import { RetainageItemItem } from "./AccordionItems/RetainageItemItem";
import { TimeActivityItem } from "./AccordionItems/TimeActivityItem";
import { BillableItemsModal } from "./BillableItemsModal/BillableItemsModal";
import { DetailCardView } from "./DetailCardView";
import NewChargeTable from "./NewChargeTable";
import { DeductionsSection } from "./SummaryTable/DeductionsSection";
import { SelectedInvoiceContextProvider } from "./contexts/SelectedInvoiceContext";
import useAutoInvoiceTotal from "./hooks/useAutoInvoiceTotal";
import EditBillableServiceModal from "./modals/EditBillableServiceModal";
import { LiveChangeContextProvider } from "@/contexts/LiveChangeContext";
import useLiveChangeTracking from "@/customHooks/useLiveChangeTracking";
import { getEntityService } from "@/sdk/services/getEntityService";
import { useInvoiceDetailViewParams } from "@/routes/_auth/invoices/$invoiceId.lazy";

export default function InvoiceDetailView() {
  const deleteMutation = useDbDelete(Invoice);
  const { invoiceId } = useInvoiceDetailViewParams();
  const invoiceRequest = useDbQueryFirst(Invoice, `WHERE c.id = "${invoiceId}"`);
  const projectRequest = useDbQueryFirst(Project, `WHERE c.id = "${invoiceRequest.data?.ProjectId}"`, {
    enabled: isUsable(invoiceRequest.data),
  });
  const workingPhasesRequest = useDbQuery(WorkingPhase, `WHERE c.ProjectId = "${invoiceRequest.data?.ProjectId}"`, {
    enabled: isUsable(invoiceRequest.data),
  });
  const [value, update, savingMutation, setValue] = useAutosaveState(Invoice, new Invoice(), { delay: 500 });
  const billableServiceUpsert = useDbUpsert(BillableService);
  const billableServiceDeleteMutation = useDbDelete(BillableService);

  useEffect(() => {
    if (invoiceRequest.data) {
      setValue((pre) => {
        return invoiceRequest.data;
      });
    }
  }, [invoiceRequest.data]);

  const isLoadingTotals = useAutoInvoiceTotal(value, update);

  const handleChargeTableTitleChange = (value: string, id: string) => {
    update((prev) => {
      const chargeTables = prev.ChargeTables;
      return { ...prev, ChargeTables: chargeTables.map((x) => (x.Id === id ? { ...x, Header: value } : x)) };
    });
  };

  const handleDeleteChargeTableItem = (
    chargeTableId: string,
    itemId: string,
    chargeTableItemType: "ExpenseItems" | "BillableServices" | "RetainageItems" | "TimeActivityItems",
  ) => {
    update((prev) => {
      const chargeTables = prev.ChargeTables;
      const chargeTable = chargeTables.find((x) => x.Id === chargeTableId);

      const selected = chargeTable[chargeTableItemType] as string[];

      const newChargeTable = { ...chargeTable };

      newChargeTable[chargeTableItemType] = selected.filter((x) => x !== itemId);
      const response = chargeTables.map((x) => (x.Id === chargeTable.Id ? newChargeTable : x));

      return { ...prev, ChargeTables: response };
    });
  };

  const handleAddNewToChargeTable = (id: string, item: BillableService) => {
    billableServiceUpsert.mutateAsync(item).then((billableService) => {
      update((prev) => {
        const chargeTables = [...prev.ChargeTables];

        return {
          ...prev,
          ChargeTables: chargeTables.map((x) =>
            x.Id === id ? { ...x, BillableServices: [...x.BillableServices, billableService.id] } : x,
          ),
        };
      });
    });
  };

  const handleAddToChargeTable = (chargeTableId: string, itemId: string, chargeTableItemType: string) => {
    update((prev) => {
      const chargeTables = prev.ChargeTables;
      const chargeTable = chargeTables.find((x) => x.Id == chargeTableId);

      const selected = chargeTable[chargeTableItemType] as string[];

      const newChargeTable = { ...chargeTable };

      newChargeTable[chargeTableItemType] = [...selected, itemId];
      const response = chargeTables.map((x) => (x.Id === chargeTable.Id ? newChargeTable : x));

      return { ...prev, ChargeTables: response };
    });
  };

  const handleDeleteChargeTable = (id: string) => {
    update((prev) => {
      const chargeTables = prev.ChargeTables;

      return { ...prev, ChargeTables: chargeTables.filter((x) => x.Id != id) };
    });
  };

  const [detailsIsShowing, setDetailsIsShowing] = useState(true);

  const changeLog = useLiveChangeTracking(invoiceRequest, (changes) => {
    setValue((pre) => {
      return { ...pre, ...changes };
    });
  });

  const [printUrl, setPrintUrl] = useState("");

  useEffect(() => {
    if (isUsable(value) === false) return;
    getEntityService(Invoice)
      .createRoute(`${value.id}/${value._etag}/print/${value.InternalName}.pdf`)
      .then((x) => {
        setPrintUrl(x);
      });
  }, [value]);
  return (
    <LiveChangeContextProvider changeLog={changeLog}>
      <SelectedInvoiceContextProvider
        invoice={value}
        update={update}
        project={projectRequest.data}
        workingPhases={workingPhasesRequest.data ?? []}
      >
        <PolRequestPresenter
          containerClassName="overflow-y"
          request={[invoiceRequest, workingPhasesRequest]}
          onSuccess={() => (
            <div className="flex flex-col gap-5 md:p-5">
              <div className="top-[48px] z-10 grid w-full grid-flow-col grid-cols-[auto_1fr_1fr_auto] gap-4 border-b bg-background-50 backdrop-blur md:sticky md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  <a target="_blank" href={printUrl}>
                    <PolButton variant="ghost">
                      <PolIcon name="Printer"></PolIcon>
                    </PolButton>
                  </a>
                  <div>
                    <PolHeading data-testid={"internal-name"} size={2} className="">
                      {value?.InternalName}
                    </PolHeading>
                    <PolHeading data-testid={"invoice-number"} size={4} className="">
                      {"Invoice #" + value.InvoiceNumber}
                    </PolHeading>
                  </div>

                  <SavingIndicator saveMutation={savingMutation} />
                </div>

                <PolMutationErrorPresenter
                  mutation={[billableServiceDeleteMutation, billableServiceUpsert, deleteMutation, savingMutation]}
                />
                <LabelSection className="ml-auto" label="Balance Due">
                  <PolHeading>{toUsdString(value.InvoiceTotal - value.AmountPaid)}</PolHeading>
                </LabelSection>
              </div>
              <div className="flex flex-col gap-4  md:flex-row ">
                {detailsIsShowing && <DetailCardView></DetailCardView>}

                <div className="flex h-fit w-full flex-col gap-4">
                  <Card className="h-fit w-full  ">
                    <CardHeader className="grid grid-flow-col grid-cols-[auto_1fr_auto] items-center space-y-0 p-1 ">
                      <PolButton
                        tooltip={detailsIsShowing ? "Hide Details" : "Show Details"}
                        className="mr-2"
                        variant="ghost"
                        data-testid="show-hide-details-button"
                        onClick={() => setDetailsIsShowing((prev) => !prev)}
                      >
                        {detailsIsShowing ? (
                          <PolIcon name="ArrowLeftFromLine" />
                        ) : (
                          <PolIcon name="ArrowRightFromLine" />
                        )}
                      </PolButton>
                      <PolHeading size={4}>Line Items</PolHeading>
                      <NewChargeTable onCreate={update}></NewChargeTable>
                    </CardHeader>
                    <CardContent className="rounded-md p-0">
                      <Accordion collapsible type="single" className="sticky-Accordian-Header">
                        {value.ChargeTables?.length > 0 &&
                          value.ChargeTables.map((chargeTable) => (
                            <AccordionItem key={chargeTable.Id} value={chargeTable.Id}>
                              <AccordionTrigger
                                data-testid={`accordion-trigger-${chargeTable.Header}`}
                                className="grid w-full grid-flow-col grid-cols-[auto_1fr_auto_auto_auto] space-x-2 bg-background-50 px-2 hover:bg-secondary-50 dark:bg-gray-900"
                              >
                                <div onClick={(x) => x.stopPropagation()}>
                                  <Dropdown
                                    className="z-[10000]"
                                    arrowIcon={false}
                                    inline
                                    label={
                                      <PolIcon
                                        data-testid={`more-vertical-${chargeTable.Header}`}
                                        name="MoreVertical"
                                      ></PolIcon>
                                    }
                                  >
                                    <Dropdown.Item
                                      className="rounded-lg"
                                      onClick={() => handleDeleteChargeTable(chargeTable.Id)}
                                    >
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown>
                                </div>

                                <PolInput
                                  data-testid="header-input"
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyUp={(e) => e.preventDefault()}
                                  containerClassName=" w-fit"
                                  className="w-fit md:min-w-[500px]"
                                  value={chargeTable.Header}
                                  onValueChanged={(x) => handleChargeTableTitleChange(x, chargeTable.Id)}
                                ></PolInput>
                                <PolLoadingSection
                                  isLoading={isLoadingTotals}
                                  onLoading={() => <PolSkeleton className="ml-5 h-8 w-24" />}
                                >
                                  <PolText className="ml-5">{toUsdString(chargeTable.AmountUsd)}</PolText>
                                </PolLoadingSection>
                              </AccordionTrigger>
                              <AccordionContent>
                                {chargeTable.RetainageItems?.length > 0 && (
                                  <div className="flex flex-col pt-5">
                                    <PolHeading size={3} className="text-center">
                                      Retainage Items
                                    </PolHeading>
                                    {chargeTable.RetainageItems.map((retainageItemId) => (
                                      <RetainageItemItem
                                        onDelete={(id) =>
                                          handleDeleteChargeTableItem(chargeTable.Id, id, "RetainageItems")
                                        }
                                        key={retainageItemId}
                                        id={retainageItemId}
                                      ></RetainageItemItem>
                                    ))}
                                  </div>
                                )}
                                {chargeTable.BillableServices?.length > 0 && (
                                  <div className="grid w-full grid-flow-row">
                                    <PolHeading size={3} className="text-center">
                                      Billable Services
                                    </PolHeading>
                                    <PolTable
                                      items={chargeTable.BillableServices}
                                      columns={[
                                        { className: "w-20" },
                                        { className: "w-28" },
                                        { className: "w-48" },
                                        { className: "w-auto" },
                                        { className: "w-16" },
                                        { className: "w-20" },
                                        { className: "w-24" },
                                        { className: "w-16" },
                                      ]}
                                      header={() => (
                                        <PolTableHeader className="sticky top-0">
                                          <PolTableCell className=""> </PolTableCell>
                                          <PolTableCell className=" text-center">Service Date</PolTableCell>
                                          <PolTableCell>Working Phase</PolTableCell>
                                          <PolTableCell>Description</PolTableCell>
                                          <PolTableCell className=" text-center">Quantity</PolTableCell>
                                          <PolTableCell className=" text-right">Rate</PolTableCell>
                                          <PolTableCell className=" text-right">Total</PolTableCell>

                                          <PolTableCell className=""> </PolTableCell>
                                        </PolTableHeader>
                                      )}
                                      itemTemplate={(id) => (
                                        <BillableServiceItem
                                          onDelete={(service) =>
                                            billableServiceDeleteMutation
                                              .mutateAsync(service)
                                              .then((x) =>
                                                handleDeleteChargeTableItem(
                                                  chargeTable.Id,
                                                  service.id,
                                                  "BillableServices",
                                                ),
                                              )
                                          }
                                          key={id}
                                          id={id}
                                        ></BillableServiceItem>
                                      )}
                                    ></PolTable>
                                  </div>
                                )}
                                {chargeTable.ExpenseItems?.length > 0 && (
                                  <div className="grid w-full grid-flow-row">
                                    <PolHeading size={3} className="text-center">
                                      Expenses
                                    </PolHeading>
                                    <PolTable
                                      items={chargeTable.ExpenseItems}
                                      columns={[
                                        { className: "w-20" },
                                        { className: "w-28" },
                                        { className: "w-48" },
                                        { className: "w-36" },
                                        { className: "w-36" },
                                        { className: "w-auto" },
                                        { className: "w-16" },
                                        { className: "w-20" },
                                        { className: "w-24" },
                                        { className: "w-16" },
                                      ]}
                                      header={() => (
                                        <PolTableHeader className="sticky top-0">
                                          <PolTableCell className="text-left font-medium"> </PolTableCell>
                                          <PolTableCell className="text-left">Date</PolTableCell>
                                          <PolTableCell className="text-left font-medium">Working Phase</PolTableCell>
                                          <PolTableCell className="text-left font-medium">User</PolTableCell>
                                          <PolTableCell className="text-left font-medium">Merchant Name</PolTableCell>
                                          <PolTableCell className="text-left font-medium">Description</PolTableCell>
                                          <PolTableCell className="text-center font-medium">Amount</PolTableCell>
                                          <PolTableCell className="text-center font-medium">Currency Rate</PolTableCell>
                                          <PolTableCell className="text-right font-medium">Total</PolTableCell>
                                          <PolTableCell className="text-left font-medium"> </PolTableCell>
                                        </PolTableHeader>
                                      )}
                                      itemTemplate={(expenseId) => (
                                        <ExpenseItem
                                          onDelete={(id) =>
                                            handleDeleteChargeTableItem(chargeTable.Id, id, "ExpenseItems")
                                          }
                                          key={expenseId}
                                          id={expenseId}
                                        ></ExpenseItem>
                                      )}
                                    ></PolTable>
                                  </div>
                                )}
                                {chargeTable.TimeActivityItems?.length > 0 && (
                                  <div className="grid w-full grid-flow-row pt-5">
                                    <PolHeading size={3} className="text-center">
                                      Time Activities
                                    </PolHeading>
                                    <PolTable
                                      items={chargeTable.TimeActivityItems}
                                      columns={[
                                        { className: "w-20" },
                                        { className: "w-28" },
                                        { className: "w-48" },
                                        { className: "w-36" },
                                        { className: "w-36" },
                                        { className: "w-36" },
                                        { className: "w-36" },
                                        { className: "w-auto" },
                                        { className: "w-16" },
                                        { className: "w-20" },
                                        { className: "w-24" },
                                        { className: "w-16" },
                                      ]}
                                      header={() => (
                                        <PolTableHeader className="sticky top-0">
                                          <PolTableCell className="text-left font-medium"> </PolTableCell>
                                          <PolTableCell className="text-left">Date</PolTableCell>
                                          <PolTableCell className="text-left font-medium">Working Phase</PolTableCell>
                                          <PolTableCell className="text-left font-medium">User</PolTableCell>
                                          <PolTableCell className="text-left font-medium">Role</PolTableCell>
                                          <PolTableCell className="ext-left font-medium">Task</PolTableCell>
                                          <PolTableCell className="text-left font-medium">Sub Task</PolTableCell>
                                          <PolTableCell className="text-left font-medium">Description</PolTableCell>
                                          <PolTableCell className="text-center font-medium">Hours</PolTableCell>
                                          <PolTableCell className="text-center font-medium">Rate</PolTableCell>
                                          <PolTableCell className="text-right font-medium">Total</PolTableCell>
                                          <PolTableCell className="text-left font-medium"> </PolTableCell>
                                        </PolTableHeader>
                                      )}
                                      itemTemplate={(timeActivityId) => (
                                        <TimeActivityItem
                                          onDelete={(id) =>
                                            handleDeleteChargeTableItem(chargeTable.Id, id, "TimeActivityItems")
                                          }
                                          id={timeActivityId}
                                        ></TimeActivityItem>
                                      )}
                                    />
                                  </div>
                                )}
                                <div className="mx-auto grid w-fit grid-flow-col space-x-5">
                                  <EditBillableServiceModal
                                    headingText="Create Billable Serivce"
                                    onCommit={(service) => handleAddNewToChargeTable(chargeTable.Id, service)}
                                    modalTrigger={
                                      <PolButton data-testid="new-billable-service-button">
                                        Create Billable Service
                                      </PolButton>
                                    }
                                  ></EditBillableServiceModal>

                                  <BillableItemsModal
                                    chargeTable={chargeTable}
                                    addServiceItem={(chargeTableId, itemId, key) =>
                                      handleAddToChargeTable(chargeTableId, itemId, key)
                                    }
                                  ></BillableItemsModal>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                      </Accordion>
                      <PolText
                        type="bold"
                        className="my-5 mr-7  text-right"
                      >{`Subtotal: ${toUsdString(value.Subtotal)}`}</PolText>
                      <DeductionsSection></DeductionsSection>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        ></PolRequestPresenter>
      </SelectedInvoiceContextProvider>
    </LiveChangeContextProvider>
  );
}
