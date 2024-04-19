import PolHeading from "@/components/polComponents/PolHeading";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import PolText from "@/components/polComponents/PolText";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useExpenseReportReviewParams } from "@/routes/_auth/expense/$globalExpenseReportId/$expenseReportId/review.lazy";
import { ExpenseLineItem } from "@/sdk/childEntities/ExpenseLineItem";
import { Expense } from "@/sdk/entities/billing/Expense";
import { ExpenseReport } from "@/sdk/entities/billing/ExpenseReport";
import { GlobalExpenseReport } from "@/sdk/entities/billing/GlobalExpenseReport";
import { TaxCategory } from "@/sdk/entities/billing/TaxCategory";
import { User } from "@/sdk/entities/core/User";
import { groupBy, sortBy, tryGetSum } from "@/sdk/utils/arrayUtils";
import { isBillable } from "@/sdk/utils/billingStatusUtils";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { FC, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ExpenseReportReview() {
  const { expenseReportId, globalExpenseReportId } = useExpenseReportReviewParams();
  const globalExpenseReport = useDbQueryFirst(GlobalExpenseReport, `WHERE c.id = "${globalExpenseReportId}"`);
  const expenseReportRequest = useDbQueryFirst(ExpenseReport, `WHERE c.id = "${expenseReportId}"`);
  const userRequest = useDbQueryFirst(User, `WHERE c.id = "${expenseReportRequest.data?.UserId}"`, {
    enabled: isUsable(expenseReportRequest.data),
  });
  const expensesRequest = useDbQuery(Expense, `WHERE c.ExpenseReportId = "${expenseReportId}"`);

  const totalAmount = useMemo(() => tryGetSum(expensesRequest.data?.map((x) => x.AmountUsd)), [expensesRequest.data]);
  return (
    <div className="px-4 pt-6">
      <div className="max-sm:grid-row-[1fr_2fr] grid rounded-lg  bg-background-100 p-4 shadow sm:p-6 md:grid-cols-[1fr_2fr] xl:p-8">
        <div className=" grid w-full items-center justify-between">
          <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
            {toUsdString(totalAmount)}
          </span>
          <PolRequestPresenter
            request={globalExpenseReport}
            onLoading={() => <PolSkeleton className="h-6" />}
            onSuccess={() => <PolHeading size={4}>{globalExpenseReport.data?.Title}</PolHeading>}
          />
          <PolRequestPresenter
            request={userRequest}
            onLoading={() => <PolSkeleton className="h-6" />}
            onSuccess={() => <PolHeading size={4}>{getFullName(userRequest.data?.Person)}</PolHeading>}
          />
        </div>
        <div className="mb-4 mt-5 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <BillableCount />
          <NotBillableCount />
          <TotalCount />
        </div>
      </div>
      <ExpenseTimelineChart />
      <ExpenseCategoryBarChart />
      <ExpenseMerchantBarChart />
    </div>
  );
}

function ExpenseMerchantBarChart() {
  const { expenseReportId, globalExpenseReportId } = useExpenseReportReviewParams();

  const expensesRequest = useDbQuery(Expense, `WHERE c.ExpenseReportId = "${expenseReportId}"`);

  const data = useMemo(() => {
    if (isUsable(expensesRequest.data) === false) return [];
    return Array.from(groupBy(sortBy(expensesRequest.data, "TxnDate"), (x) => x.MerchantName).values()).map(
      (expense) => {
        const groupAmount = tryGetSum(
          expense.map((x) => {
            return x.AmountUsd;
          }),
        );
        return {
          name: expense[0].MerchantName,
          "Total Amount": groupAmount,
          expenseLineItems: expense.map((x) => x.LineItems),
          expenses: expense,
        };
      },
    );
  }, [expensesRequest.data]);
  return (
    <div className="mt-4 rounded-lg bg-background-100 p-4 shadow  sm:p-6 xl:p-8">
      <PolHeading size={2} className="mb-5 text-center">
        Merchants
      </PolHeading>
      <PolRequestPresenter
        request={[expensesRequest]}
        onLoading={() => <PolSkeleton className="h-[400px] w-[90dvw]" />}
        onSuccess={() => (
          <div className="h-[400px] w-[90dvw]">
            <ResponsiveContainer>
              <BarChart data={data} className="overflow-x-auto">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis fontSize={11} dataKey="name" className="overflow-x-auto" />
                <YAxis fontSize={11} tickFormatter={(value) => toUsdString(value)} />
                <Bar dataKey="Total Amount" fill="#8884d8" barSize={100} />
                <Tooltip
                  cursor={false}
                  content={({ active, payload, label }) => (
                    <MerchantNameTooltip active={active} payload={payload} label={label} />
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      />
    </div>
  );
}

const MerchantNameTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const expenses = payload[0].payload.expenses as Expense[];
    const groupAmount = payload[0].payload.groupAmount;
    return (
      <div className="grid  grid-flow-row rounded-md border bg-background-100 p-4">
        <div className="grid w-full grid-flow-col space-x-5">
          <PolHeading size={4}>{label}</PolHeading>
          <PolHeading className="ml-auto text-right" size={4}>
            {toUsdString(payload[0].value)}
          </PolHeading>
        </div>
        <div className="grid w-full grid-flow-row">
          {expenses.map((x) => (
            <div className="grid w-full grid-flow-col space-x-4 border-t">
              <PolText>{x.TxnDate.format("MM-DD-YYYY")}</PolText>
              <PolText className="ml-auto text-right">{toUsdString(x.AmountUsd)}</PolText>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

function ExpenseCategoryBarChart() {
  const { expenseReportId, globalExpenseReportId } = useExpenseReportReviewParams();

  const expensesRequest = useDbQuery(Expense, `WHERE c.ExpenseReportId = "${expenseReportId}"`);
  const taxCategoryRequest = useDbQuery(
    TaxCategory,
    `WHERE c.id IN ["${expensesRequest.data
      ?.flatMap((x) => x.LineItems)
      .map((x) => x.CategoryId)
      .join(`","`)}"]`,
  );
  const data = useMemo(() => {
    if (isUsable(expensesRequest.data) === false) return [];
    if (isUsable(taxCategoryRequest.data) === false) return [];
    return Array.from(
      groupBy(
        sortBy(expensesRequest.data, "TxnDate").flatMap((x) => x.LineItems),
        (x) => x.CategoryId,
      ).values(),
    ).map((lineItems) => {
      console.log(lineItems);
      const category = taxCategoryRequest.data.find((e) => e.id === lineItems[0].CategoryId);
      const groupAmount = tryGetSum(
        lineItems.map((x) => {
          const expense = expensesRequest.data.find((e) => e.LineItems.includes(x));

          return x.Amount * expense.CurrencyRateToUsd;
        }),
      );
      return {
        name: category?.Title ?? "Unknown",
        "Total Amount": groupAmount,
        expenseLineItems: lineItems,
        expenses: lineItems.map((x) => expensesRequest.data.find((e) => e.LineItems.includes(x))),
      };
    });
  }, [expensesRequest.data, taxCategoryRequest.data]);
  return (
    <div className="mt-4 rounded-lg bg-background-100 p-4 shadow  sm:p-6 xl:p-8">
      <PolHeading size={2} className="mb-5 text-center">
        Expense Categories
      </PolHeading>
      <PolRequestPresenter
        request={[expensesRequest, taxCategoryRequest]}
        onLoading={() => <PolSkeleton className="h-[400px] w-[90dvw]" />}
        onSuccess={() => (
          <div className="h-[400px] w-[90dvw]">
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis fontSize={11} dataKey="name" />
                <YAxis fontSize={11} tickFormatter={(value) => toUsdString(value)} />
                <Bar dataKey="Total Amount" fill="#8884d8" barSize={100} />
                <Tooltip
                  cursor={false}
                  content={({ active, payload, label }) => (
                    <ExpenseLineItemTooltip active={active} payload={payload} label={label} />
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      />
    </div>
  );
}

const ExpenseTimelineChart: FC = function () {
  const { expenseReportId, globalExpenseReportId } = useExpenseReportReviewParams();
  const globalExpenseReport = useDbQueryFirst(GlobalExpenseReport, `WHERE c.id = "${globalExpenseReportId}"`);
  const expensesRequest = useDbQuery(Expense, `WHERE c.ExpenseReportId = "${expenseReportId}"`);

  const totalAmount = useMemo(() => tryGetSum(expensesRequest.data?.map((x) => x.AmountUsd)), [expensesRequest.data]);

  return (
    <div className="mt-4 rounded-lg bg-background-100 p-4 shadow  sm:p-6 xl:p-8">
      <PolHeading size={2} className="mb-5 text-center">
        Expense Timeline
      </PolHeading>
      <SalesChart />
    </div>
  );
};

const SalesChart: FC = function () {
  const { expenseReportId } = useExpenseReportReviewParams();
  const expensesRequest = useDbQuery(Expense, `WHERE c.ExpenseReportId = "${expenseReportId}"`);

  const data = useMemo(() => {
    let totalAmount = 0;
    if (isUsable(expensesRequest.data) === false) return [];
    return Array.from(
      groupBy(sortBy(expensesRequest.data, "TxnDate"), (x) => x.TxnDate.format("MM-DD-YYYY")).values(),
    ).map((x) => {
      const groupAmount = tryGetSum(x.map((x) => x.AmountUsd));
      totalAmount += groupAmount;
      return {
        amt: groupAmount,
        name: x[0].TxnDate.format("MM-DD-YYYY"),
        "Total Amount": totalAmount,
        expenses: x,
        groupAmount: groupAmount,
      };
    });
  }, [expensesRequest.data]);

  return (
    <PolRequestPresenter
      request={expensesRequest}
      ready={isUsable(data)}
      onLoading={() => <PolSkeleton className="h-[400px] w-[90dvw]" />}
      onSuccess={() => (
        <div className="h-[400px] w-[90dvw] ">
          <ResponsiveContainer>
            <LineChart width={500} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis fontSize={11} dataKey="name" padding={{ left: 30, right: 30 }} />
              <YAxis fontSize={11} tickFormatter={(value) => toUsdString(value)} />
              <Tooltip
                content={({ active, payload, label }) => (
                  <CustomTooltip active={active} payload={payload} label={label} />
                )}
              />
              <Legend />
              <Line type="linear" dataKey="Total Amount" stroke="#82ca9d" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    />
  );
};

const ExpenseLineItemTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const expenses = payload[0].payload.expenses as Expense[];
    const expenseLineItems = payload[0].payload.expenseLineItems as ExpenseLineItem[];
    const groupAmount = payload[0].payload.groupAmount;
    return (
      <div className="grid   grid-flow-row  rounded-md border bg-background-100 p-4">
        <div className="grid w-full grid-flow-col space-x-5">
          <PolHeading size={4}>{label}</PolHeading>
          <PolHeading className="ml-auto text-right" size={4}>
            {toUsdString(payload[0].value)}
          </PolHeading>
        </div>
        <div className="grid max-h-[300px] w-full grid-flow-row overflow-y-auto">
          {expenseLineItems.map((e) => {
            const expense = expenses.find((i) => i.LineItems.includes(e));
            return (
              <div className="grid w-full grid-flow-col space-x-4 border-t">
                <PolText>{expense.MerchantName}</PolText>
                <PolText className="ml-auto text-right">{toUsdString(e.Amount * expense.CurrencyRateToUsd)}</PolText>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const expenses = payload[0].payload.expenses as Expense[];
    const groupAmount = payload[0].payload.groupAmount;
    return (
      <div className="grid  grid-flow-row rounded-md border bg-background-100 p-4">
        <div className="grid w-full grid-flow-col space-x-5">
          <PolHeading size={4}>{label}</PolHeading>
          <PolHeading className="ml-auto text-right" size={4}>
            {toUsdString(payload[0].value)}
          </PolHeading>
        </div>
        <div className="grid w-full grid-flow-row">
          {expenses.map((x) => (
            <div className="grid w-full grid-flow-col space-x-4 border-t">
              <PolText>{x.MerchantName}</PolText>
              <PolText className="ml-auto text-right">{toUsdString(x.AmountUsd)}</PolText>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const NotBillableCount: FC = function () {
  const { expenseReportId, globalExpenseReportId } = useExpenseReportReviewParams();
  const expensesRequest = useDbQuery(Expense, `WHERE c.ExpenseReportId = "${expenseReportId}"`);
  const notBillableItems = useMemo(
    () => expensesRequest.data?.filter((x) => isBillable(x.BillingDetails.Status) === false) ?? [],
    [expensesRequest.data],
  );
  return (
    <div className="rounded-lg bg-background-50 p-4 shadow  sm:p-6 xl:p-8">
      <div className="flex items-center">
        <div className="shrink-0">
          <PolRequestPresenter
            request={expensesRequest}
            onLoading={() => <PolSkeleton className="h-8" />}
            onSuccess={() => (
              <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
                {notBillableItems.length}
              </span>
            )}
          />
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">Not Billable</h3>
        </div>
        <div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-green-600 dark:text-green-400">
          {toUsdString(tryGetSum(notBillableItems.map((x) => x.AmountUsd)))}
        </div>
      </div>
      <VisitorsChart />
    </div>
  );
};

const BillableCount: FC = function () {
  const { expenseReportId, globalExpenseReportId } = useExpenseReportReviewParams();
  const expensesRequest = useDbQuery(Expense, `WHERE c.ExpenseReportId = "${expenseReportId}"`);
  const billableitems = useMemo(
    () => expensesRequest.data?.filter((x) => isBillable(x.BillingDetails.Status)) ?? [],
    [expensesRequest.data],
  );
  return (
    <div className="rounded-lg bg-background-50 p-4 shadow  sm:p-6 xl:p-8">
      <div className="flex items-center">
        <div className="shrink-0">
          <PolRequestPresenter
            request={expensesRequest}
            onLoading={() => <PolSkeleton className="h-8" />}
            onSuccess={() => (
              <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
                {billableitems.length}
              </span>
            )}
          />
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">Billable</h3>
        </div>
        <div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-green-600 dark:text-green-400">
          {toUsdString(tryGetSum(billableitems.map((x) => x.AmountUsd)))}
        </div>
      </div>
      <VisitorsChart />
    </div>
  );
};

const VisitorsChart: FC = function () {
  return <></>;
};

const TotalCount: FC = function () {
  const { expenseReportId, globalExpenseReportId } = useExpenseReportReviewParams();
  const expensesRequest = useDbQuery(Expense, `WHERE c.ExpenseReportId = "${expenseReportId}"`);
  return (
    <div className="rounded-lg bg-background-50 p-4 shadow  sm:p-6 xl:p-8">
      <div className="flex items-center">
        <div className="shrink-0">
          <PolRequestPresenter
            request={expensesRequest}
            onLoading={() => <PolSkeleton className="h-8" />}
            onSuccess={() => (
              <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
                {expensesRequest.data.length}
              </span>
            )}
          />
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">Total</h3>
        </div>
        <div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-green-600 dark:text-green-400">
          {toUsdString(tryGetSum(expensesRequest.data?.map((x) => x.AmountUsd)))}
        </div>
      </div>
    </div>
  );
};
