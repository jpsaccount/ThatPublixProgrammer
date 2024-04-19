import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { Seo } from "@/components/polComponents/Seo";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { Project } from "@/sdk/entities/project/Project";
import ProjectBillingQuickReview from "./ProjectBillingQuickReview";
import { BillableService } from "@/sdk/entities/billing/BillableService";
import { Expense } from "@/sdk/entities/billing/Expense";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { sortBy, tryGetSum } from "@/sdk/utils/arrayUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useMemo, useState } from "react";
import PolHeading from "@/components/polComponents/PolHeading";
import PolText from "@/components/polComponents/PolText";
import { isOnInvoice } from "@/sdk/utils/billingStatusUtils";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import PolIcon from "@/components/PolIcon";
import { InvoiceStatus } from "@/sdk/enums/InvoiceStatus";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { RetainageItem } from "@/sdk/entities/billing/RetainageItems";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import { PolButton } from "@/components/polComponents/PolButton";
import { Progress } from "@/components/ui/progress";
import BillableItemsAmountUsedChart from "./BillableItemsAmountUsedChart";
import { Client } from "@/sdk/entities/project/Client";
import BillableItemsReadToBillHistoryChart from "./BillableItemsReadToBillHistoryChart";
import { Link } from "@tanstack/react-router";
import { useProjectBillingPageParams } from "@/routes/_auth/projects/$projectId/billing/index.lazy";
const RADIAN = Math.PI / 180;
const BillableColors = ["lightgreen", "red"];
const BilledColors = ["green", "grey"];
const ItemTypes = ["blue", "orange", "green"];

const renderBillableLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "middle" : "middle"} dominantBaseline="central">
      {`${name} - ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderCategoriesLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  console.log(percent);

  return `${name} - ${(percent * 100).toFixed(2)}%`;
};

function RetainageRowView({ retainage }: { retainage: RetainageItem }) {
  const invoiceRequest = useDbQueryFirst(Invoice, `WHERE c.id = "${retainage.InvoiceId}"`);
  const navigate = usePolNavigate();
  return (
    <PolRequestPresenter
      containerClassName="h-auto"
      request={invoiceRequest}
      onLoading={() => <PolSkeleton className="mt-2 h-8" />}
      onSuccess={() => (
        <Link
          className="grid cursor-pointer grid-flow-col px-2 py-1 hover:bg-background-100"
          to={"/invoices/" + invoiceRequest.data.id}
        >
          <PolText>
            {invoiceRequest.data.InternalName} ({invoiceRequest.data.InvoiceNumber})
          </PolText>

          <PolText className="ml-auto mr-0">{toUsdString(retainage.AmountUsdRetained)}</PolText>
        </Link>
      )}
    />
  );
}

export default function ProjectBillingMainPage() {
  const { projectId } = useProjectBillingPageParams();

  const navigate = usePolNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const projectRequest = useDbQueryFirst(Project, `WHERE c.id = "${projectId}"`);
  const clientRequest = useDbQueryFirst(Client, `WHERE c.id = "${projectRequest.data?.ClientId}"`, {
    enabled: isUsable(projectRequest.data),
  });
  const timeActivitiesRequest = useDbQuery(
    TimeActivity,
    `WHERE c.ProjectId = "${projectId}" Order By c.ActivityDate ASC`,
  );

  const billableServiceRequest = useDbQuery(
    BillableService,
    `WHERE Query("6c7850a4-fe3e-498d-b789-d31390b677d5", c.WorkingPhaseId).ProjectId = "${projectId}"`,
  );

  const expenseRequest = useDbQuery(
    Expense,
    `WHERE Query("6c7850a4-fe3e-498d-b789-d31390b677d5", c.WorkingPhaseId).ProjectId = "${projectId}"`,
  );
  const retainageRequest = useDbQuery(
    RetainageItem,
    `WHERE Query("6c7850a4-fe3e-498d-b789-d31390b677d5", c.WorkingPhaseId).ProjectId = "${projectId}"`,
  );
  const invoiceRequest = useDbQuery(Invoice, `WHERE c.ProjectId = "${projectId}"`);
  const workingPhaseRequest = useDbQuery(WorkingPhase, `WHERE c.ProjectId = "${projectId}"`);

  const billablePercentData = useMemo(
    () => getItemsBillablePercent(timeActivitiesRequest.data, expenseRequest.data, billableServiceRequest.data),
    [timeActivitiesRequest.data, expenseRequest.data, billableServiceRequest.data],
  );

  const billedPercent = useMemo(
    () =>
      getBilledPercentageData(
        timeActivitiesRequest.data,
        expenseRequest.data,
        billableServiceRequest.data,
        workingPhaseRequest.data,
      ),
    [timeActivitiesRequest.data, expenseRequest.data, billableServiceRequest.data, workingPhaseRequest.data],
  );
  const timeAmountTotals = useMemo(
    () => tryGetSum(timeActivitiesRequest.data?.map((x) => x.BillableRate * x.Hours)),
    [timeActivitiesRequest.data],
  );
  const expenseAmountTotal = useMemo(
    () => tryGetSum(expenseRequest.data?.map((x) => x.AmountUsd)),
    [expenseRequest.data],
  );
  const billableAmountTotal = useMemo(
    () => tryGetSum(billableServiceRequest.data?.map((x) => x.AmountUsd)),
    [billableServiceRequest.data],
  );
  const totalAmountAllotted = useMemo(
    () => tryGetSum(workingPhaseRequest.data?.map((x) => x.AmountAllotted)),
    [workingPhaseRequest.data],
  );

  return (
    <>
      <Seo title="Project Billing" />

      <PolRequestPresenter
        request={[projectRequest, timeActivitiesRequest, expenseRequest]}
        onSuccess={() => (
          <div className="grid grid-flow-row gap-10 p-5">
            <PolHeading className="sticky top-[50px] z-10 mx-auto rounded bg-primary-300/45 px-10 py-2 backdrop-blur">
              <PolRequestPresenter
                request={[clientRequest, projectRequest]}
                onLoading={() => <PolSkeleton className="h-9 w-96" />}
                onSuccess={() => `${clientRequest.data?.CompanyName}: ${projectRequest.data?.Name}`}
              />
            </PolHeading>
            <ProjectBillingQuickReview
              timeActivities={timeActivitiesRequest.data}
              billableServices={billableServiceRequest.data}
              expenses={expenseRequest.data}
            />
            <div className="grid grid-flow-row">
              <PolHeading className="mt-5 text-center">Working Phases</PolHeading>
              <div className="grid grid-flow-col overflow-x-auto">
                {sortBy(workingPhaseRequest.data, "ShowInTimesheet", true)?.map((x) => (
                  <Link
                    to={`/projects/$projectId/billing/working-phases/analytics/$workingPhaseId`}
                    search={{ workingPhaseId: x.id }}
                    className="m-2 grid h-32 w-[300px] grid-flow-row 
                    gap-2 rounded-md
                    border bg-background-100 p-2 shadow transition hover:scale-105"
                  >
                    <div className="grid grid-flow-col gap-2">
                      <PolText className="truncate">{x.DisplayName}</PolText>
                      <PolIcon
                        name="Clock"
                        stroke={x.ShowInTimesheet ? "var(--text-800)" : "var(--text-100)"}
                        className="ml-auto"
                      />
                    </div>
                    <div className="mb-0 mt-auto">
                      <Progress
                        value={Math.min(x.AmountUsed / x.AmountAllotted, 1)}
                        max={1}
                        className=" h-4 w-full bg-background-200"
                      ></Progress>
                      {((x.AmountUsed / x.AmountAllotted) * 100).toFixed(2) + "%"} used
                    </div>
                  </Link>
                ))}
              </div>
              <PolButton
                onClick={() => navigate({ to: "/projects/$projectId/billing/working-phases" })}
                variant="ghost"
                className="m-auto"
              >
                View More...
              </PolButton>
            </div>
            <div className="grid grid-flow-row gap-10">
              <div className="grid grid-flow-row">
                <div className="grid  grid-flow-col grid-cols-[.6fr_1fr] gap-10">
                  <div className="grid grid-flow-row">
                    <PolHeading className="mt-5 text-center" size={2}>
                      Invoices
                    </PolHeading>
                    <div className="mt-12 grid h-[400px] grid-flow-row overflow-y-auto">
                      {invoiceRequest.data?.map((x) => <InvoiceRow x={x} />)}
                    </div>
                  </div>
                  <div className="grid grid-flow-row">
                    <PolHeading className="mt-5 text-center" size={2}>
                      Retainage
                    </PolHeading>
                    <div className="mt-12 flex h-[400px] flex-col overflow-y-auto">
                      {retainageRequest.data?.map((x) => <RetainageRowView retainage={x}></RetainageRowView>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-flow-row">
                <PolHeading className="mt-5 text-center" size={2}>
                  Total Activity Amount
                </PolHeading>
                <BillableItemsAmountUsedChart
                  expenses={expenseRequest.data}
                  timeActivities={timeActivitiesRequest.data}
                  billableServices={billableServiceRequest.data}
                  limit={totalAmountAllotted}
                />
              </div>
              <div className="grid grid-flow-row">
                <PolHeading className="mt-5 text-center" size={2}>
                  Unbilled Activities
                </PolHeading>
                <BillableItemsReadToBillHistoryChart
                  invoices={invoiceRequest.data}
                  expenses={expenseRequest.data}
                  timeActivities={timeActivitiesRequest.data}
                  billableServices={billableServiceRequest.data}
                  limit={totalAmountAllotted}
                />
              </div>

              <div className="grid grid-flow-row">
                <div className="grid  grid-flow-col grid-cols-[1fr_1fr_2fr]">
                  <div className="h-[400px] ">
                    <PolHeading className="mt-5 text-center" size={2}>
                      Percentage Billable
                    </PolHeading>

                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={billablePercentData}
                          dataKey="amount"
                          nameKey="name"
                          valueKey={"name"}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderBillableLabel}
                        >
                          <Cell key={`cell-1`} fill={BillableColors[0]} />
                          <Cell key={`cell-2`} fill={BillableColors[1]} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-[400px] ">
                    <PolHeading className="mt-5 text-center" size={2}>
                      Percentage Billed
                    </PolHeading>

                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={billedPercent}
                          dataKey="amount"
                          nameKey="name"
                          valueKey={"name"}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderBillableLabel}
                        >
                          <Cell key={`cell-1`} fill={BilledColors[0]} />
                          <Cell key={`cell-2`} fill={BilledColors[1]} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-[400px] ">
                    <PolHeading className="mt-5 text-center" size={2}>
                      Activity Types
                    </PolHeading>

                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Time Activities", amount: timeAmountTotals },
                            { name: "Expenses", amount: expenseAmountTotal },
                            { name: "Billable Service", amount: billableAmountTotal },
                          ]}
                          dataKey="amount"
                          nameKey="name"
                          valueKey={"name"}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCategoriesLabel}
                        >
                          <Cell key={`cell-1`} fill={ItemTypes[0]} />
                          <Cell key={`cell-2`} fill={ItemTypes[1]} />
                          <Cell key={`cell-3`} fill={ItemTypes[2]} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      />
    </>
  );

  function InvoiceRow({ x }: { x: Invoice }) {
    const timeItems = useMemo(() => x.ChargeTables.flatMap((x) => x.TimeActivityItems), [x]);
    const billableItems = useMemo(() => x.ChargeTables.flatMap((x) => x.BillableServices), [x]);
    const expenseItems = useMemo(() => x.ChargeTables.flatMap((x) => x.ExpenseItems), [x]);
    return (
      <Link
        to={"/invoices/" + x.id}
        className="grid cursor-pointer grid-flow-col grid-cols-[auto_auto_auto_auto_1fr_.2fr] px-2 hover:bg-background-100"
      >
        <PolIcon
          name="Clock"
          size="18"
          className="mx-2 my-auto"
          hintText={timeItems.length > 0 ? "Includes time activities" : ""}
          stroke={timeItems.length > 0 ? "Green" : "var(--text-200)"}
        />
        <PolIcon
          name="Receipt"
          size="18"
          className="mx-2 my-auto"
          hintText={expenseItems.length > 0 ? "Includes expense items" : ""}
          stroke={expenseItems.length > 0 ? "Green" : "var(--text-200)"}
        />
        <PolIcon
          name="Briefcase"
          size="18"
          className="mx-2 my-auto"
          hintText={billableItems.length > 0 ? "Includes billable service items" : ""}
          stroke={billableItems.length > 0 ? "Green" : "var(--text-200)"}
        />
        <PolIcon
          name="DollarSign"
          size="18"
          className="mx-2 my-auto"
          hintText={x.Status === InvoiceStatus.Paid ? "Paid" : "Pending payment"}
          stroke={x.Status === InvoiceStatus.Paid ? "Green" : "Grey"}
        />
        <PolText className="my-auto text-left">{x.InternalName}</PolText>
        <PolText className="my-auto text-right">{toUsdString(x.InvoiceTotal)}</PolText>
      </Link>
    );
  }
}

function getItemsBillablePercent(
  timeActivities: TimeActivity[],
  expenses: Expense[],
  billableServices: BillableService[],
) {
  if (isUsable(timeActivities) == false || isUsable(expenses) === false || isUsable(billableServices) === false)
    return [];
  const items = [
    ...timeActivities.map((x) => ({
      amount: x.Hours + x.BillableRate,
      isBillable: isOnInvoice(x.BillingDetails.Status),
    })),
    ...expenses.map((x) => ({
      amount: x.AmountUsd,
      isBillable: isOnInvoice(x.BillingDetails.Status),
    })),
    ...billableServices.map((x) => ({
      amount: x.AmountUsd,
      isBillable: isOnInvoice(x.BillingDetails.Status),
    })),
  ];

  return [
    { name: "Billable", amount: tryGetSum(items.filter((x) => x.isBillable).map((x) => x.amount)) },
    { name: "Not Billable", amount: tryGetSum(items.filter((x) => x.isBillable === false).map((x) => x.amount)) },
  ];
}

function getBilledPercentageData(
  timeActivities: TimeActivity[],
  expenses: Expense[],
  billableServices: BillableService[],
  workingPhases: WorkingPhase[],
) {
  if (
    isUsable(timeActivities) == false ||
    isUsable(expenses) === false ||
    isUsable(billableServices) === false ||
    isUsable(workingPhases) === false
  ) {
    return [];
  }
  const items = [
    ...timeActivities.map((x) => ({
      amount: x.Hours + x.BillableRate,
      isBillable: isOnInvoice(x.BillingDetails.Status),
    })),
    ...expenses.map((x) => ({
      amount: x.AmountUsd,
      isBillable: isOnInvoice(x.BillingDetails.Status),
    })),
    ...billableServices.map((x) => ({
      amount: x.AmountUsd,
      isBillable: isOnInvoice(x.BillingDetails.Status),
    })),
  ];
  const amountBilled = tryGetSum(items.filter((x) => x.isBillable).map((x) => x.amount));

  return [
    { name: "Billed", amount: amountBilled },
    { name: "Left", amount: tryGetSum(workingPhases.map((x) => x.AmountAllotted)) - amountBilled },
  ];
}
