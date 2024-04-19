import PolHeading from "@/components/polComponents/PolHeading";
import PolText from "@/components/polComponents/PolText";
import { BillableService } from "@/sdk/entities/billing/BillableService";
import { Expense } from "@/sdk/entities/billing/Expense";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { BillingStatus } from "@/sdk/enums/BillingStatus";
import { groupBy, sortBy, tryGetSum } from "@/sdk/utils/arrayUtils";
import { isBillable, isLumpSum } from "@/sdk/utils/billingStatusUtils";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import React, { useMemo } from "react";
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
  limit?: number;
}
export default function BillableItemsAmountUsedChart({ timeActivities, expenses, billableServices, limit }: Props) {
  const data = useMemo(() => {
    if (isUsable(timeActivities) === false) return [];
    if (isUsable(expenses) === false) return [];
    if (isUsable(billableServices) === false) return [];

    return GetData(timeActivities, expenses, billableServices);
  }, [timeActivities, expenses, billableServices]);
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
  return (
    <div className="h-[400px] ">
      <ResponsiveContainer>
        <LineChart width={500} height={300} data={data}>
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
          {data[data.length - 1]?.["Not Billable"] > 0 && (
            <Line type="linear" dataKey="Not Billable" stroke="darkred" dot={false} />
          )}
          {data[data.length - 1]?.Lumpsum > 0 && <Line type="linear" dataKey="Lumpsum" stroke="orange" dot={false} />}
          {data[data.length - 1]?.Billable > 0 && <Line type="linear" dataKey="Billable" stroke="green" dot={false} />}
          {data[data.length - 1]?.Unknown > 0 && <Line type="linear" dataKey="Unknown" stroke="Black" dot={false} />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function GetData(timeActivities: TimeActivity[], expenses: Expense[], billableServices: BillableService[]) {
  let lumpsum = 0;
  let billableAmount = 0;
  let notBillableAmount = 0;
  let unknownAmount = 0;

  var groupedTimes = Array.from(
    groupBy(sortBy(timeActivities, "ActivityDate"), (x) => x.ActivityDate?.format("MM-DD-YYYY")).values(),
  );
  var groupedExpenses = Array.from(
    groupBy(sortBy(expenses, "TxnDate"), (x) => x.TxnDate?.format("MM-DD-YYYY")).values(),
  );
  var groupedBillableServices = Array.from(
    groupBy(sortBy(billableServices, "ServiceDate"), (x) => x.ServiceDate?.format("MM-DD-YYYY")).values(),
  );
  return sortBy(
    [
      ...groupedTimes.map((x) => {
        const billableAmount = tryGetSum(
          x.filter((x) => isBillable(x.BillingDetails.Status)).map((x) => x.Hours * x.BillableRate),
        );
        const notBillableAmount = tryGetSum(
          x
            .filter(
              (x) =>
                (isBillable(x.BillingDetails.Status) || isLumpSum(x.BillingDetails.Status)) === false &&
                x.BillingDetails.Status != BillingStatus.Unknown,
            )
            .map((x) => x.Hours * x.BillableRate),
        );
        const lumpsumAmount = tryGetSum(
          x.filter((x) => isLumpSum(x.BillingDetails.Status)).map((x) => x.Hours * x.BillableRate),
        );
        const unknownAmount = tryGetSum(
          x.filter((x) => x.BillingDetails.Status === BillingStatus.Unknown).map((x) => x.Hours * x.BillableRate),
        );
        return {
          notBillableAmount: notBillableAmount,
          billableAmount: billableAmount,
          lumpsumAmount: lumpsumAmount,
          unknownAmount: unknownAmount,

          date: x[0].ActivityDate,
          name: x[0].ActivityDate?.format("MM-DD-YYYY"),
          items: x,
        };
      }),
      ...groupedExpenses.map((x) => {
        const billableAmount = tryGetSum(x.filter((x) => isBillable(x.BillingDetails.Status)).map((x) => x.AmountUsd));
        const notBillableAmount = tryGetSum(
          x
            .filter(
              (x) =>
                (isBillable(x.BillingDetails.Status) || isLumpSum(x.BillingDetails.Status)) === false &&
                x.BillingDetails.Status != BillingStatus.Unknown,
            )
            .map((x) => x.AmountUsd),
        );
        const lumpsumAmount = tryGetSum(x.filter((x) => isLumpSum(x.BillingDetails.Status)).map((x) => x.AmountUsd));
        const unknownAmount = tryGetSum(
          x.filter((x) => x.BillingDetails.Status === BillingStatus.Unknown).map((x) => x.AmountUsd),
        );
        return {
          notBillableAmount: notBillableAmount,
          billableAmount: billableAmount,
          lumpsumAmount: lumpsumAmount,
          unknownAmount: unknownAmount,

          date: x[0].TxnDate,
          name: x[0].TxnDate?.format("MM-DD-YYYY"),
          items: x,
        };
      }),
      ...groupedBillableServices.map((x) => {
        const billableAmount = tryGetSum(x.filter((x) => isBillable(x.BillingDetails.Status)).map((x) => x.AmountUsd));
        const notBillableAmount = tryGetSum(
          x
            .filter(
              (x) =>
                (isBillable(x.BillingDetails.Status) || isLumpSum(x.BillingDetails.Status)) === false &&
                x.BillingDetails.Status != BillingStatus.Unknown,
            )
            .map((x) => x.AmountUsd),
        );
        const lumpsumAmount = tryGetSum(x.filter((x) => isLumpSum(x.BillingDetails.Status)).map((x) => x.AmountUsd));
        const unknownAmount = tryGetSum(
          x.filter((x) => x.BillingDetails.Status === BillingStatus.Unknown).map((x) => x.AmountUsd),
        );
        return {
          notBillableAmount: notBillableAmount,
          billableAmount: billableAmount,
          lumpsumAmount: lumpsumAmount,
          unknownAmount: unknownAmount,
          date: x[0].ServiceDate,
          name: x[0].ServiceDate?.format("MM-DD-YYYY"),
          items: x,
        };
      }),
    ],
    "date",
  ).map((x) => {
    lumpsum += x.lumpsumAmount;
    unknownAmount += x.unknownAmount;
    notBillableAmount += x.notBillableAmount;
    billableAmount += x.billableAmount;
    return {
      ...x,

      Lumpsum: lumpsum,
      Billable: billableAmount,
      "Not Billable": notBillableAmount,
      Unknown: unknownAmount,
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
          {dataPoint["Lumpsum"] > 0 && (
            <div className="grid grid-flow-col">
              <PolText>Lumpsum:</PolText>
              <PolText className="text-right">{toUsdString(dataPoint["Lumpsum"])}</PolText>
            </div>
          )}
          {dataPoint["Billable"] > 0 && (
            <div className="grid grid-flow-col">
              <PolText>Billable:</PolText>
              <PolText className="text-right">{toUsdString(dataPoint["Billable"])}</PolText>
            </div>
          )}
          {dataPoint["Not Billable"] > 0 && (
            <div className="grid w-full grid-flow-col">
              <PolText>Not Billable:</PolText>
              <PolText className="text-right">{toUsdString(dataPoint["Not Billable"])}</PolText>
            </div>
          )}
          {dataPoint["Unknown"] > 0 && (
            <div className="grid w-full grid-flow-col">
              <PolText>Unknown:</PolText>
              <PolText className="text-right">{toUsdString(dataPoint["Unknown"])}</PolText>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
