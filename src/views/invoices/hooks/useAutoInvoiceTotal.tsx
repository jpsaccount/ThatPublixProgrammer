import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { Expense } from "@/sdk/entities/billing/Expense";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { tryGetSum } from "@/sdk/utils/arrayUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import React, { useEffect, useMemo, useState } from "react";
import { BillableService } from "@/sdk/entities/billing/BillableService";
import { RetainageItem } from "@/sdk/entities/billing/RetainageItems";
import { convertArrayToObject } from "@/utilities/arrayUtilities";

export default function useAutoInvoiceTotal(
  invoice: Invoice,
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>,
) {
  const [isLoadingTotals, setIsLoadingTotals] = useState(true);
  const timeActivitiesRequest = useDbQuery(
    TimeActivity,
    `WHERE c.id IN ["${invoice?.ChargeTables.flatMap((x) => x.TimeActivityItems).join('", "')}"]`,
    { enabled: isUsable(invoice) },
  );

  const expenseRequest = useDbQuery(
    Expense,
    `WHERE c.id IN ["${invoice?.ChargeTables.flatMap((x) => x.ExpenseItems).join('", "')}"]`,
    { enabled: isUsable(invoice) },
  );

  const billableItemsRequest = useDbQuery(
    BillableService,
    `WHERE c.id IN ["${invoice?.ChargeTables.flatMap((x) => x.BillableServices).join('", "')}"]`,
    { enabled: isUsable(invoice) },
  );

  const chargeTableRetainageItemsRequest = useDbQuery(
    RetainageItem,
    `WHERE c.id IN ["${invoice?.ChargeTables.flatMap((x) => x.RetainageItems).join('", "')}"]`,
    { enabled: isUsable(invoice) },
  );

  const deductionRetainageRequest = useDbQuery(
    RetainageItem,
    `WHERE c.id IN ["${invoice?.SummaryTable.RetainageItems.join('","')}"]`,
    { enabled: isUsable(invoice) },
  );

  const timeActivities = useMemo(
    () => convertArrayToObject(timeActivitiesRequest.data, "id"),
    [timeActivitiesRequest.data],
  );

  useEffect(() => {
    if (isUsable(timeActivitiesRequest.data) === false || timeActivitiesRequest.isLoading) {
      setIsLoadingTotals(true);
      return;
    }
    if (isUsable(expenseRequest.data) === false || expenseRequest.isLoading) {
      setIsLoadingTotals(true);
      return;
    }

    if (isUsable(billableItemsRequest.data) === false || billableItemsRequest.isLoading) {
      setIsLoadingTotals(true);
      return;
    }

    if (isUsable(chargeTableRetainageItemsRequest.data) === false || chargeTableRetainageItemsRequest.isLoading) {
      setIsLoadingTotals(true);
      return;
    }

    if (isUsable(deductionRetainageRequest.data) === false || deductionRetainageRequest.isLoading) {
      setIsLoadingTotals(true);
      return;
    }
    let anyAmountChanges = false;
    const newChargeTables = invoice.ChargeTables.map((x) => {
      const timeAmount = tryGetSum(
        x.TimeActivityItems.map((x) => timeActivities[x])
          .filter((x) => isUsable(x))
          .map((x) => x.BillableRate * x.Hours),
      );
      const expensesAmount = tryGetSum(
        x.ExpenseItems.map((x) => expenseRequest.data.find((t) => t.id == x))
          .filter((x) => isUsable(x))
          .map((x) => x.AmountUsd),
      );
      const retainageAmount = tryGetSum(
        x.RetainageItems.map((x) => chargeTableRetainageItemsRequest.data.find((t) => t.id == x))
          .filter((x) => isUsable(x))
          .map((x) => x.AmountUsdRetained),
      );
      const billableServiceAmount = tryGetSum(
        x.BillableServices.map((x) => billableItemsRequest.data.find((t) => t.id == x))
          .filter((x) => isUsable(x))
          .map((x) => x.AmountUsd),
      );
      const newAmount = billableServiceAmount + retainageAmount + expensesAmount + timeAmount;
      if (newAmount != x.AmountUsd) {
        anyAmountChanges = true;
      }
      return { ...x, AmountUsd: newAmount };
    });

    const deductionAmount = tryGetSum(
      invoice.SummaryTable.RetainageItems.map((x) => deductionRetainageRequest.data.find((t) => t.id == x))
        .filter((x) => isUsable(x))
        .map((x) => x.AmountUsd),
    );
    const subtotal = tryGetSum(newChargeTables.map((x) => x.AmountUsd));

    console.log("calculating amounts", deductionAmount, deductionRetainageRequest.data);
    const invoiceTotal = subtotal + deductionAmount;
    if (invoiceTotal != invoice.InvoiceTotal) {
      anyAmountChanges = true;
    }
    if (subtotal != invoice.Subtotal) {
      anyAmountChanges = true;
    }
    if (anyAmountChanges) {
      setInvoice((x) =>
        x.id === invoice.id
          ? {
              ...invoice,
              ChargeTables: newChargeTables,
              Subtotal: subtotal,
              InvoiceTotal: invoiceTotal,
            }
          : x,
      );
    }
    setIsLoadingTotals(false);
  }, [
    invoice.ChargeTables,
    timeActivitiesRequest.data,
    timeActivitiesRequest.isLoading,
    expenseRequest.data,
    expenseRequest.isLoading,
    billableItemsRequest.data,
    billableItemsRequest.isLoading,
    chargeTableRetainageItemsRequest.data,
    chargeTableRetainageItemsRequest.isLoading,
    deductionRetainageRequest.data,
    deductionRetainageRequest.isLoading,
  ]);

  return isLoadingTotals;
}
