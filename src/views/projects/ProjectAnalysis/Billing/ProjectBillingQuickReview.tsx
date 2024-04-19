import PolIcon from "@/components/PolIcon";
import { BillableService } from "@/sdk/entities/billing/BillableService";
import { Expense } from "@/sdk/entities/billing/Expense";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { BillingStatus } from "@/sdk/enums/BillingStatus";
import { tryGetSum } from "@/sdk/utils/arrayUtils";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { toDecimalString } from "@/sdk/utils/numberUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import moment from "moment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import React, { useMemo } from "react";
function calculateTotalFromTimeActivities(timeActivities: TimeActivity[]): number {
  return tryGetSum(timeActivities?.map((x) => x.Hours * x.BillableRate));
}
function calculateTotalFromBillableServices(billableTimeActivities: BillableService[]): number {
  return tryGetSum(billableTimeActivities?.map((x) => x.Quantity * x.Rate));
}
function calculateTotalFromExpenses(expenses: Expense[]): number {
  return tryGetSum(expenses?.map((x) => x.AmountUsd));
}

function calculateTotalHours(timeActivities: TimeActivity[]): number {
  return tryGetSum(timeActivities?.map((x) => x.Hours));
}
function getExpensesWithinLastMonth(expenses: Expense[]): Expense[] {
  const currentDate = moment.utc();
  const lastMonth = moment.utc().add(-1, "months");

  return expenses?.filter((item) => item.TxnDate >= lastMonth && item.TxnDate <= currentDate);
}
function getBillableServicesWithinLastMonth(billableServices: BillableService[]): BillableService[] {
  const currentDate = moment.utc();
  const lastMonth = moment.utc().add(-1, "months");

  return billableServices?.filter((item) => item.ServiceDate >= lastMonth && item.ServiceDate <= currentDate);
}

function getTimeActivitiesWithinLastMonth(timeAcivities: TimeActivity[]): TimeActivity[] {
  const currentDate = moment.utc();
  const lastMonth = moment.utc().add(-1, "months");

  return timeAcivities?.filter((item) => item.ActivityDate >= lastMonth && item.ActivityDate <= currentDate);
}

interface Props {
  timeActivities: TimeActivity[];
  billableServices: BillableService[];
  expenses: Expense[];
}

export default function ProjectBillingQuickReview({ timeActivities, billableServices, expenses }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Billable</CardTitle>
          <PolIcon name="attach_money" source="google" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {toUsdString(
              calculateTotalFromTimeActivities(timeActivities) +
                calculateTotalFromBillableServices(billableServices) +
                calculateTotalFromExpenses(expenses),
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            {`+${toUsdString(
              calculateTotalFromTimeActivities(getTimeActivitiesWithinLastMonth(timeActivities)) +
                calculateTotalFromBillableServices(getBillableServicesWithinLastMonth(billableServices)) +
                calculateTotalFromExpenses(getExpensesWithinLastMonth(expenses)),
            )} from last month`}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          <PolIcon name="group" source="google" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{`${toDecimalString(calculateTotalHours(timeActivities), 2)}`}</div>
          <p className="text-muted-foreground text-xs">
            {`+${toDecimalString(
              calculateTotalHours(getTimeActivitiesWithinLastMonth(timeActivities)),
              2,
            )} hrs from last month`}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ready To Bill</CardTitle>

          <PolIcon name="payments" source="google" />
        </CardHeader>
        <CardContent>
          <ReadToBillCardContent
            timeActivities={timeActivities}
            billableServices={billableServices}
            expenses={expenses}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Items</CardTitle>
          <PolIcon name="lists" source="google" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{`${toDecimalString(timeActivities.length)}`}</div>
          <p className="text-muted-foreground text-xs">
            {`+${toDecimalString(getTimeActivitiesWithinLastMonth(timeActivities).length)} in the last month`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ReadToBillCardContent({ timeActivities, expenses }: Props) {
  const allBillableTime = useMemo(
    () => timeActivities.filter((x) => x.BillingDetails.Status === BillingStatus.Billable),
    [timeActivities],
  );

  const allBillableExpenses = useMemo(
    () => expenses.filter((x) => x.BillingDetails.Status === BillingStatus.Billable),
    [expenses],
  );

  const billableAmount = calculateTotalFromTimeActivities(allBillableTime);

  const expenseAmount = tryGetSum(allBillableExpenses.map((x) => x.AmountUsd));

  return (
    <>
      <div className="text-2xl font-bold">{`+${toUsdString(expenseAmount + billableAmount)}`}</div>
      <p className="text-muted-foreground text-xs">
        {`+${toUsdString(
          calculateTotalFromTimeActivities(getTimeActivitiesWithinLastMonth(allBillableTime)) +
            calculateTotalFromExpenses(getExpensesWithinLastMonth(allBillableExpenses)),
        )} from last month`}
      </p>
    </>
  );
}
