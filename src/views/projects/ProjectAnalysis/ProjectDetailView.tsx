import { PolButton } from "@/components/polComponents/PolButton";
import { Project } from "@/sdk/entities/project/Project";
import EditorProjectDetailForm from "@/views/projects/EditorProjectDetailForm";

import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { Seo } from "@/components/polComponents/Seo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import useWindowDimensions from "@/customHooks/useWindowDimensions";
import { BillableService } from "@sdk/./entities/billing/BillableService";
import { Expense } from "@sdk/./entities/billing/Expense";
import { TimeActivity } from "@sdk/./entities/billing/TimeActivity";
import { toUsdString } from "@sdk/./utils/moneyUtils";
import { toDecimalString } from "@sdk/./utils/numberUtils";
import moment from "moment/moment";
import { MonthlyData, OverviewChart } from "./OverviewChart";
import { RecentTimeActivities } from "./RecentTimeEntries";
import ProjectBillingQuickReview from "./Billing/ProjectBillingQuickReview";
import { useProjectDetailViewParams } from "@/routes/_auth/projects/$projectId/index.lazy";

function getTimeActivitiesWithinLastMonth(timeAcivities: TimeActivity[]): TimeActivity[] {
  const currentDate = moment.utc();
  const lastMonth = moment.utc().add(-1, "months");

  return timeAcivities?.filter((item) => item.ActivityDate >= lastMonth && item.ActivityDate <= currentDate);
}

const ProjectDetailView = () => {
  const { projectId } = useProjectDetailViewParams();
  const navigate = usePolNavigate();

  const projectRequest = useDbQueryFirst(Project, `WHERE c.id = "${projectId}"`);
  const { height, width } = useWindowDimensions();

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

  function generateMonthlyData(): MonthlyData[] {
    const currentDate = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const startingMonthIndex = (currentDate.getMonth() + 1) % 12;

    const last12Months = months.slice(startingMonthIndex).concat(months.slice(0, startingMonthIndex));

    const currentYear = currentDate.getFullYear();

    const pastDate = moment().subtract(11, "months").days(0);

    const filteredTimeActivities = timeActivitiesRequest.data.filter((item) => {
      const itemMonthIndex = item.ActivityDate?.month();

      return item.ActivityDate?.isSameOrAfter(pastDate) && last12Months.includes(months[itemMonthIndex]);
    });

    const filteredBillableServices = billableServiceRequest.data.filter((item) => {
      const itemMonthIndex = item.ServiceDate?.month();

      return item.ServiceDate?.isSameOrAfter(pastDate) && last12Months.includes(months[itemMonthIndex]);
    });
    const filteredExpenses = expenseRequest.data.filter((item) => {
      const itemMonthIndex = item.TxnDate?.month();

      return item.TxnDate?.isSameOrAfter(pastDate) && last12Months.includes(months[itemMonthIndex]);
    });

    const monthlyData: MonthlyData[] = last12Months.map((month) => ({
      name: month,
      total: 0,
    }));

    filteredTimeActivities.forEach((item) => {
      const itemMonthIndex = item.ActivityDate?.month();
      const totalAmount = item.BillableRate * item.Hours;
      monthlyData[last12Months.indexOf(months[itemMonthIndex])].total += totalAmount;
    });
    filteredBillableServices.forEach((item) => {
      const itemMonthIndex = item.ServiceDate?.month();
      const totalAmount = item.Quantity * item.Rate;
      monthlyData[last12Months.indexOf(months[itemMonthIndex])].total += totalAmount;
    });
    filteredExpenses.forEach((item) => {
      const itemMonthIndex = item.TxnDate.month();
      const totalAmount = item.AmountUsd;
      monthlyData[last12Months.indexOf(months[itemMonthIndex])].total += totalAmount;
    });
    return monthlyData;
  }

  return (
    <>
      <Seo title={projectRequest.data?.Nickname} />

      <PolRequestPresenter
        request={[timeActivitiesRequest, billableServiceRequest, expenseRequest, projectRequest]}
        onSuccess={() => (
          <ScrollArea className=" h-full-woh w-full p-2 max-sm:p-0">
            <div className="grid flex-1 grid-flow-row space-y-4 p-8 pt-6 ">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{projectRequest.data?.Name}</h2>
                <div className="flex gap-3">
                  <EditorProjectDetailForm project={projectRequest.data} />
                  <PolButton
                    variant="outline"
                    onClick={() => navigate({ to: "/projects/$projectId/documents", params: { projectId } })}
                  >
                    Edit Documents
                  </PolButton>
                </div>
              </div>

              <div className="grid grid-flow-row">
                <ProjectBillingQuickReview
                  timeActivities={timeActivitiesRequest.data}
                  billableServices={billableServiceRequest.data}
                  expenses={expenseRequest.data}
                />
                <PolButton
                  variant="ghost"
                  className="ml-auto mr-0 mt-2 w-fit"
                  onClick={() => navigate({ to: "/projects/$projectId/billing", params: { projectId } })}
                >
                  See more billing...
                </PolButton>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription className="text-start">
                      {`+${toDecimalString(
                        getTimeActivitiesWithinLastMonth(timeActivitiesRequest.data).length,
                      )} time activities from last month`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <OverviewChart
                      height={height / 2}
                      totalValueGetter={(x) => toUsdString(x)}
                      data={generateMonthlyData()}
                    />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle className="text-start">Recent Time Activities</CardTitle>
                    <CardDescription className="text-start">
                      {`+${toDecimalString(
                        getTimeActivitiesWithinLastMonth(timeActivitiesRequest.data).length,
                      )} time activities from last month`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[50dvh] p-0 px-4">
                    <PolRequestPresenter
                      request={timeActivitiesRequest}
                      onSuccess={() => {
                        return (
                          <RecentTimeActivities
                            timeActivities={getTimeActivitiesWithinLastMonth(timeActivitiesRequest.data).sort(
                              (a, b) => b.ActivityDate.valueOf() - a.ActivityDate.valueOf(),
                            )}
                          ></RecentTimeActivities>
                        );
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        )}
      />
    </>
  );
};

export default ProjectDetailView;
