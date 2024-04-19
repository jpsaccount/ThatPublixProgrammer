import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { Progress } from "@/components/ui/progress";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { useProjectBillingPageParams } from "@/routes/_auth/projects/$projectId/billing/index.lazy";
import { useProjectBillingWorkingPhasePageParams } from "@/routes/_auth/projects/$projectId/billing/working-phases/index.lazy";
import { BillableService } from "@/sdk/entities/billing/BillableService";
import { Expense } from "@/sdk/entities/billing/Expense";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import { RetainageItem } from "@/sdk/entities/billing/RetainageItems";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { WorkingPhaseCategory } from "@/sdk/entities/billing/WorkingPhaseCategory";
import { Project } from "@/sdk/entities/project/Project";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { groupBy, tryGetSum } from "@/sdk/utils/arrayUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Link } from "@tanstack/react-router";
import React, { useMemo, useState } from "react";

export default function ProjectBillingWorkingPhasePage() {
  const { projectId } = useProjectBillingWorkingPhasePageParams();

  const navigate = usePolNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const projectRequest = useDbQueryFirst(Project, `WHERE c.id = "${projectId}"`);
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
  const workingPhasesInGroups = useMemo(
    () => groupBy(workingPhaseRequest.data, "CategoryId"),
    [workingPhaseRequest.data],
  );
  const workingPhaseCategoryRequest = useDbQuery(
    WorkingPhaseCategory,
    `WHERE c.id IN ["${workingPhaseRequest.data?.map((x) => x.CategoryId).join('","')}"]`,
    { enabled: isUsable(workingPhaseRequest.data) },
  );
  return (
    <div className="mx-auto grid w-1/2 grid-flow-row">
      <PolHeading className="text-center">Working Phases</PolHeading>

      <PolRequestPresenter
        request={workingPhaseCategoryRequest}
        ready={isUsable(workingPhasesInGroups)}
        onSuccess={() => (
          <Accordion>
            {Array.from(workingPhasesInGroups.keys()).map((key) => {
              const workingPhases = workingPhasesInGroups.get(key);
              const workingPhaseCategory = workingPhaseCategoryRequest.data.find((x) => x.id == key);
              return (
                <AccordionItem
                  title={
                    <div className="grid grid-flow-col grid-cols-[auto_1fr] gap-2">
                      {workingPhaseCategory && (
                        <PolButton
                          tooltip="Analyze Category"
                          variant="ghost"
                          href={`analytics?workingPhaseCategory=${workingPhaseCategory?.id}`}
                        >
                          <PolIcon name="FileBarChart2" />
                        </PolButton>
                      )}
                      <PolText className="my-auto">{workingPhaseCategory?.Title ?? "Unknown"}</PolText>
                      <PolText className="my-auto">
                        {(
                          (tryGetSum(workingPhases.map((x) => x.AmountUsed)) /
                            tryGetSum(workingPhases.map((x) => x.AmountAllotted))) *
                          100
                        ).toFixed(2)}{" "}
                        %
                      </PolText>
                    </div>
                  }
                >
                  <div className="grid grid-flow-row">
                    {workingPhases.map((x) => (
                      <Link to={`analytics/` + x.id} className="cursor-pointer p-1 px-5  hover:bg-background-100">
                        <div className="grid grid-flow-col">
                          <PolText>{x.DisplayName}</PolText>
                          <PolText className="text-right">
                            {((x.AmountUsed / x.AmountAllotted) * 100).toFixed(2) + "%"}
                          </PolText>
                        </div>
                      </Link>
                    ))}
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      />
    </div>
  );
}
