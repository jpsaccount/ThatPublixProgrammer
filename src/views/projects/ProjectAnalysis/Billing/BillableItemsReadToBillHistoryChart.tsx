import PolHeading from "@/components/polComponents/PolHeading";
import PolModal from "@/components/polComponents/PolModal";
import PolText from "@/components/polComponents/PolText";
import { BillableService } from "@/sdk/entities/billing/BillableService";
import { Expense } from "@/sdk/entities/billing/Expense";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { BillingStatus } from "@/sdk/enums/BillingStatus";
import { groupBy, sortBy, tryGetSum } from "@/sdk/utils/arrayUtils";
import { isBillable, isLumpSum } from "@/sdk/utils/billingStatusUtils";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { time } from "console";
import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
} from "recharts";

interface Props {
  timeActivities: TimeActivity[];
  expenses: Expense[];
  billableServices: BillableService[];
  invoices: Invoice[];
  limit?: number;
}
export default function BillableItemsReadToBillHistoryChart({
  timeActivities,
  expenses,
  billableServices,
  invoices,
  limit,
}: Props) {
  const data = useMemo(() => {
    if (isUsable(timeActivities) === false) return [];
    if (isUsable(expenses) === false) return [];
    if (isUsable(billableServices) === false) return [];
    if (isUsable(invoices) === false) return [];

    return GetData(timeActivities, expenses, billableServices, invoices);
  }, [timeActivities, expenses, billableServices, invoices]);

  const CustomLabel = ({ viewBox, offset = 0, value }) => {
    // Assuming `viewBox` or a similar prop that gives dimensions; otherwise, you may need to use fixed dimensions or pass them as props
    const { width, y, x } = viewBox; // This needs to be known or estimated if not directly available
    const xPosition = (width + x) / 2; // Center horizontally

    return (
      <text x={xPosition} y={y + 20} fill="red" textAnchor="middle">
        {"Allotted Amount: " + toUsdString(limit)}
      </text>
    );
  };

  const [billableItems, setBillableItems] = useState(null);
  console.log(billableItems);

  return (
    <>
      <PolModal isOpen={isUsable(billableItems)} onOpenChanged={() => setBillableItems(null)}>
        <div className="flex h-[50dvh] w-[50dvw] flex-col gap-5 overflow-y-auto border p-5">
          {billableItems?.items?.map((group) => (
            <div className="border ">
              <PolText>{group.date?.format("MM-DD-YYY")}</PolText>
              {group.items?.map((x) => {
                <PolText>{x.WorkingPhaseId}</PolText>;
              })}
            </div>
          ))}
        </div>
      </PolModal>
      <div className="h-[400px] ">
        <ResponsiveContainer>
          <LineChart
            width={500}
            height={300}
            data={data}
            onClick={(e) => {
              setBillableItems(data.filter((x) => x.date.isSameOrBefore(e.activePayload[0].payload.date))[0]);
            }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis fontSize={11} dataKey="name" padding={{ left: 30, right: 30 }} />
            <YAxis
              fontSize={11}
              tickFormatter={(value) => toUsdString(value)}
              width={75}
              domain={["auto", (dataMax) => Math.max(dataMax, limit)]}
            />
            <ReferenceLine y={limit} label={CustomLabel} stroke="red" strokeDasharray="10 10 " />

            <Tooltip
              cursor={false}
              content={({ active, payload, label }) => (
                <ProjectDaySummaryToolTip active={active} payload={payload} label={label} />
              )}
            />
            <Legend />

            {<Line type="linear" dataKey="Amount" stroke="green" dot={false} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

function GetData(
  timeActivities: TimeActivity[],
  expenses: Expense[],
  billableServices: BillableService[],
  invoices: Invoice[],
) {
  let billableAmount = 0;

  var groupedTimes = Array.from(
    groupBy(
      sortBy(
        timeActivities.filter((x) => isBillable(x.BillingDetails.Status)),
        "ActivityDate",
      ),
      (x) => x.ActivityDate?.format("MM-DD-YYYY"),
    ).values(),
  );
  var groupedExpenses = Array.from(
    groupBy(
      sortBy(
        expenses.filter((x) => isBillable(x.BillingDetails.Status)),
        "TxnDate",
      ),
      (x) => x.TxnDate?.format("MM-DD-YYYY"),
    ).values(),
  );
  var groupedBillableServices = Array.from(
    groupBy(
      sortBy(
        billableServices.filter((x) => isBillable(x.BillingDetails.Status)),
        "ServiceDate",
      ),
      (x) => x.ServiceDate?.format("MM-DD-YYYY"),
    ).values(),
  );
  return sortBy(
    [
      ...groupedTimes.map((x) => {
        const billableAmount = tryGetSum(
          x.filter((x) => isBillable(x.BillingDetails.Status)).map((x) => x.Hours * x.BillableRate),
        );
        return {
          billableAmount: billableAmount ?? 0,

          date: x[0].ActivityDate,
          name: x[0].ActivityDate?.format("MM-DD-YYYY"),
          items: x,
        };
      }),
      ...groupedExpenses.map((x) => {
        const billableAmount = tryGetSum(x.filter((x) => isBillable(x.BillingDetails.Status)).map((x) => x.AmountUsd));

        return {
          billableAmount: billableAmount,

          date: x[0].TxnDate,
          name: x[0].TxnDate?.format("MM-DD-YYYY"),
          items: x,
        };
      }),
      ...groupedBillableServices.map((x) => {
        const billableAmount = tryGetSum(x.filter((x) => isBillable(x.BillingDetails.Status)).map((x) => x.AmountUsd));

        return {
          billableAmount: billableAmount,
          date: x[0].ServiceDate,
          name: x[0].ServiceDate?.format("MM-DD-YYYY"),
          items: x,
        };
      }),
      ...invoices.map((x) => {
        const timeItems = Array.from(
          new Set(x.ChargeTables.flatMap((x) => x.TimeActivityItems).map((x) => timeActivities.find((i) => i.id == x))),
        ).filter((x) => isUsable(x));
        const expenseItems = Array.from(
          new Set(x.ChargeTables.flatMap((x) => x.ExpenseItems).map((x) => expenses.find((i) => i.id == x))),
        ).filter((x) => isUsable(x));
        const billableItems = Array.from(
          new Set(
            x.ChargeTables.flatMap((x) => x.BillableServices).map((x) => billableServices.find((i) => i.id == x)),
          ),
        ).filter((x) => isUsable(x));

        const lineItemAmounts =
          tryGetSum(billableItems.map((x) => x.AmountUsd)) +
          tryGetSum(expenseItems.map((x) => x.AmountUsd)) +
          tryGetSum(timeItems.map((x) => x.Hours * x.BillableRate));
        return {
          billableAmount: -1 * lineItemAmounts,
          date: x.InvoiceDate,
          name: x.InvoiceDate?.format("MM-DD-YYYY"),
          items: x,
        };
      }),
    ],
    "date",
  ).map((x) => {
    billableAmount += x.billableAmount;
    return {
      ...x,

      Amount: billableAmount,
    };
  });
}

const ProjectDaySummaryToolTip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="grid   min-w-64  grid-flow-row rounded-md border bg-background-100 p-4">
        <div className="grid w-full grid-flow-row">
          <PolHeading size={4}>{label}</PolHeading>
          {
            <div className="grid grid-flow-col">
              <PolText>Unbilled Amount:</PolText>
              <PolText className="text-right">{toUsdString(dataPoint["Amount"])}</PolText>
            </div>
          }
        </div>
      </div>
    );
  }

  return null;
};
