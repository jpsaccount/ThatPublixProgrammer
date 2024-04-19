import { PolButton } from "@/components/polComponents/PolButton";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import { PolDatePicker } from "@/components/polComponents/PolDatePicker";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolModal from "@/components/polComponents/PolModal";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { BillableService } from "@/sdk/entities/billing/BillableService";
import { ChargeTable } from "@/sdk/entities/billing/ChargeTable";
import { RetainageItem } from "@/sdk/entities/billing/RetainageItems";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { Moment } from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import { BillableServiceItemInsideModal } from "./BillableServiceItemInsideModal";
import { RetainageItemInsideModal } from "./RetainageItemInsideModal";
import { TimeActivityItemInsideModal } from "./TimeActivityItemInsideModal";
import { PhaseBillingType } from "@/sdk/enums/PhaseBillingType";
import { Expense } from "@/sdk/entities/billing/Expense";
import PolText from "@/components/polComponents/PolText";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { ExpenseItemInsideModal } from "./ExpenseitemInsideModal";
import { sortBy } from "@/sdk/utils/arrayUtils";
import { delay } from "@/sdk/utils/asyncUtils";
import { SelectedInvoiceContext } from "../contexts/SelectedInvoiceContext";
import { useEditable } from "@chakra-ui/react";

export function BillableItemsModal({
  addServiceItem,
  chargeTable,
}: {
  addServiceItem: (chargeTableId: string, itemId: string, chargeTableItemType: keyof ChargeTable) => void;
  chargeTable: ChargeTable;
}) {
  const [showResults, setShowResults] = useState(false);
  const [fromDate, setFromDate] = useState<Moment>(null);
  const [toDate, setToDate] = useState<Moment>(null);
  const { invoice, workingPhases } = useContext(SelectedInvoiceContext);
  const [workingPhaseId, setWorkingPhaseId] = useState<string>("");
  const [filterSettings, setFilterSettings] = useState<string[]>([]);

  const searchIsReady = useMemo(() => {
    return fromDate !== null && toDate !== null && workingPhaseId !== "" && filterSettings.length !== 0;
  }, [fromDate, toDate, workingPhaseId, filterSettings]);

  const billableServicesRequest = useDbQuery(
    BillableService,
    `WHERE c.WorkingPhaseId = "${workingPhaseId}" AND c.ServiceDate >= "${fromDate?.format(
      "YYYY-MM-DDTHH:mm:ss",
    )}" AND c.ServiceDate <= "${toDate?.format("YYYY-MM-DDTHH:mm:ss")}" AND c.BillingDetails.Status = 2`,
    {
      enabled: searchIsReady && filterSettings.includes("Billable"),
      staleTime: 0,
    },
  );

  const timeActivitiesRequest = useDbQuery(
    TimeActivity,
    `WHERE c.WorkingPhaseId = "${workingPhaseId}" AND c.ActivityDate >= "${fromDate?.format(
      "YYYY-MM-DDTHH:mm:ss",
    )}" AND c.ActivityDate <= "${toDate?.format("YYYY-MM-DDTHH:mm:ss")}" AND c.BillingDetails.Status = 2`,
    {
      enabled: searchIsReady && filterSettings.includes("Time"),
      staleTime: 0,
    },
  );

  const retainageItemsRequest = useDbQuery(
    RetainageItem,
    `WHERE c.BillingDetails.Status = 2 AND c.WorkingPhaseId = "${workingPhaseId}" AND Query("a7981476-5e6e-49aa-8873-afd2477c86ad", c.BillingDetails.InvoiceId).CreatedDateTime >= "${fromDate?.format("YYYY-MM-DDTHH:mm:ss")}" AND Query("a7981476-5e6e-49aa-8873-afd2477c86ad", c.BillingDetails.InvoiceId).CreatedDateTime <= "${toDate?.format("YYYY-MM-DDTHH:mm:ss")}"`,

    {
      enabled: searchIsReady && filterSettings.includes("Retainage"),
      staleTime: 0,
    },
  );

  const expenseItemsRequest = useDbQuery(
    Expense,
    `WHERE c.BillingDetails.Status = 2 AND c.WorkingPhaseId = "${workingPhaseId}" AND c.TxnDate >= "${fromDate?.format("YYYY-MM-DDTHH:mm:ss")}" AND c.TxnDate <= "${toDate?.format("YYYY-MM-DDTHH:mm:ss")}"`,
    {
      enabled: searchIsReady && filterSettings.includes("Expense"),
      staleTime: 0,
    },
  );

  const [displayItems, setDisplayItems] = useState<Array<{ item: any; type: string }>>(null);

  const checkAlreadyAdded = (
    chargeTableProperty: "RetainageItems" | "ExpenseItems" | "TimeActivityItems" | "BillableServices",
    id: string,
  ) => {
    return chargeTable[chargeTableProperty].includes(id);
  };

  const [open, setOpen] = useState(false);
  const handleAddAll = async () => {
    if (filterSettings.includes("Retainage")) {
      sortBy(retainageItemsRequest.data, "CreatedDateTime").forEach((x) => {
        if (!checkAlreadyAdded("RetainageItems", x.id)) {
          addServiceItem(chargeTable.Id, x.id, "RetainageItems");
        }
      });
    }
    if (filterSettings.includes("Billable")) {
      sortBy(billableServicesRequest.data, "ServiceDate").forEach((x) => {
        if (!checkAlreadyAdded("BillableServices", x.id)) {
          addServiceItem(chargeTable.Id, x.id, "BillableServices");
        }
      });
    }
    if (filterSettings.includes("Time")) {
      sortBy(timeActivitiesRequest.data, "ActivityDate").forEach((x) => {
        if (!checkAlreadyAdded("TimeActivityItems", x.id)) {
          addServiceItem(chargeTable.Id, x.id, "TimeActivityItems");
        }
      });
    }
    if (filterSettings.includes("Expense")) {
      sortBy(expenseItemsRequest.data, "TxnDate").forEach((x) => {
        if (!checkAlreadyAdded("ExpenseItems", x.id)) {
          addServiceItem(chargeTable.Id, x.id, "ExpenseItems");
        }
      });
    }
    delay(500).then((x) => timeActivitiesRequest.refetch());
    setOpen(false);
  };

  useEffect(() => {
    let newDisplayItems = [];

    if (showResults === false) {
      return;
    }

    if (
      filterSettings.includes("Retainage") &&
      isUsable(retainageItemsRequest.data) &&
      retainageItemsRequest.data.length > 0
    ) {
      newDisplayItems.push(
        ...sortBy(retainageItemsRequest.data, "CreatedDateTime").map((x) => ({ item: x, type: "Retainage" })),
      );
    }
    if (
      filterSettings.includes("Billable") &&
      isUsable(billableServicesRequest.data) &&
      billableServicesRequest.data.length > 0
    ) {
      newDisplayItems.push(
        ...sortBy(billableServicesRequest.data, "ServiceDate").map((x) => ({ item: x, type: "Billable" })),
      );
    }
    if (
      filterSettings.includes("Time") &&
      isUsable(timeActivitiesRequest.data) &&
      timeActivitiesRequest.data.length > 0
    ) {
      newDisplayItems.push(
        ...sortBy(timeActivitiesRequest.data, "ActivityDate").map((x) => ({ item: x, type: "Time" })),
      );
    }
    if (
      filterSettings.includes("Expense") &&
      isUsable(expenseItemsRequest.data) &&
      expenseItemsRequest.data.length > 0
    ) {
      newDisplayItems.push(...sortBy(expenseItemsRequest.data, "TxnDate").map((x) => ({ item: x, type: "Expense" })));
    }

    setDisplayItems(newDisplayItems);

    setShowResults(false);
  }, [
    retainageItemsRequest.data,
    billableServicesRequest.data,
    timeActivitiesRequest.data,
    expenseItemsRequest.data,
    showResults,
  ]);

  const handleSearch = async () => {
    await Promise.all([
      retainageItemsRequest.refetch(),
      billableServicesRequest.refetch(),
      timeActivitiesRequest.refetch(),
      expenseItemsRequest.refetch(),
    ]);
    setShowResults(true);
  };

  const availableWorkingPhases = useMemo(() => {
    let availablePhases = [];

    if (filterSettings.includes("Billable")) {
      availablePhases.push(...workingPhases.filter((x) => x.PhaseBillingType === PhaseBillingType.LumpSum));
    }
    if (filterSettings.includes("Time")) {
      availablePhases.push(...workingPhases.filter((x) => x.PhaseBillingType === PhaseBillingType.TimeAndMaterials));
    }

    if (filterSettings.includes("Expense")) {
      availablePhases.push(...workingPhases.filter((x) => x.PhaseBillingType === PhaseBillingType.Expenses));
    }

    if (filterSettings.includes("Retainage")) {
      availablePhases = workingPhases.filter(
        (x) =>
          x.PhaseBillingType !== PhaseBillingType.NotBillable &&
          x.PhaseBillingType !== PhaseBillingType.Unknown &&
          x.PhaseBillingType !== PhaseBillingType.TBD,
      );
    }

    return availablePhases;
  }, [filterSettings]);

  const handleAdd = (itemId: string, key: keyof ChargeTable) => {
    addServiceItem(chargeTable.Id, itemId, key);
  };

  return (
    <PolModal
      onOpenChanged={setOpen}
      heading="Search"
      className=""
      isOpen={open}
      modalTrigger={
        <PolButton onClick={() => setOpen(true)} className="w-fit" data-testid="billable-item-modal-button">
          Add Billable Items
        </PolButton>
      }
    >
      <div className="flex w-full flex-col md:w-[50vw]" data-testid="billable-modal">
        <div className="flex flex-col gap-3">
          <div className="mt-5 flex flex-col items-center">
            <PolText>Filter</PolText>
            <div className="flex justify-center">
              <PolCheckbox
                value={filterSettings.includes("Billable")}
                onValueChanged={(isChecked) => {
                  if (isChecked) {
                    setFilterSettings((prev) => [...prev, "Billable"]);
                  } else {
                    setFilterSettings((prev) => prev.filter((item) => item !== "Billable"));
                  }
                }}
              >
                Billable Service Items
              </PolCheckbox>
              <PolCheckbox
                value={filterSettings.includes("Retainage")}
                onValueChanged={(isChecked) => {
                  if (isChecked) {
                    setFilterSettings((prev) => [...prev, "Retainage"]);
                  } else {
                    setFilterSettings((prev) => prev.filter((item) => item !== "Retainage"));
                  }
                }}
              >
                Retainage Items
              </PolCheckbox>
            </div>
            <div className="flex justify-center">
              <PolCheckbox
                value={filterSettings.includes("Time")}
                onValueChanged={(isChecked) => {
                  if (isChecked) {
                    setFilterSettings((prev) => [...prev, "Time"]);
                  } else {
                    setFilterSettings((prev) => prev.filter((item) => item !== "Time"));
                  }
                }}
              >
                Time Activites
              </PolCheckbox>
              <PolCheckbox
                value={filterSettings.includes("Expense")}
                onValueChanged={(isChecked) => {
                  if (isChecked) {
                    setFilterSettings((prev) => [...prev, "Expense"]);
                  } else {
                    setFilterSettings((prev) => prev.filter((item) => item !== "Expense"));
                  }
                }}
              >
                Expense Items
              </PolCheckbox>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <PolDatePicker onValueChanged={(x) => setFromDate(x)} value={fromDate} label="From"></PolDatePicker>
            <PolDatePicker onValueChanged={(x) => setToDate(x)} value={toDate} label="To"></PolDatePicker>
          </div>
          <PolEntityDropdown
            label="Working Phase"
            isSearchable={false}
            nameGetter={(x) => {
              const displayName = x.DisplayName;
              const maxLength = 43;
              if (displayName.length > maxLength) {
                return displayName.substring(0, maxLength) + "...";
              } else {
                return displayName;
              }
            }}
            options={availableWorkingPhases}
            onValueChanged={(x) => setWorkingPhaseId(x.id)}
            selectedId={workingPhaseId}
          ></PolEntityDropdown>
        </div>
        <PolButton className="mt-5" disabled={!searchIsReady} onClick={handleSearch}>
          {searchIsReady ? "Search" : "Fill Out Form"}
        </PolButton>
        {displayItems !== null && (
          <>
            <div className="mt-4 flex max-h-96 flex-row flex-wrap gap-2 overflow-auto">
              {displayItems !== null &&
                displayItems.map((displayItem, index) => {
                  switch (displayItem.type) {
                    case "Billable":
                      return (
                        <BillableServiceItemInsideModal
                          billableService={displayItem.item}
                          addServiceItem={handleAdd}
                        ></BillableServiceItemInsideModal>
                      );
                    case "Time":
                      return (
                        <TimeActivityItemInsideModal
                          timeActivity={displayItem.item}
                          addTimeActivity={handleAdd}
                        ></TimeActivityItemInsideModal>
                      );
                    case "Retainage":
                      return (
                        <RetainageItemInsideModal
                          retainageItem={displayItem.item}
                          addRetainageItem={handleAdd}
                        ></RetainageItemInsideModal>
                      );
                    case "Expense":
                      return (
                        <ExpenseItemInsideModal
                          expense={displayItem.item}
                          addExpenseItem={handleAdd}
                        ></ExpenseItemInsideModal>
                      );
                  }
                })}
            </div>
            {displayItems === null ||
              (displayItems.length === 0 && (
                <PolText className="mt-5 text-center">No billable items found. Try a different search.</PolText>
              ))}
            {displayItems?.length !== 0 && (
              <PolButton className="my-5" onClick={handleAddAll}>
                Add All
              </PolButton>
            )}
          </>
        )}
      </div>
    </PolModal>
  );
}
