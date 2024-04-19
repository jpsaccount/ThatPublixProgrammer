import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import PolTableCell from "@/components/polComponents/PolTableCell";
import PolTableRow from "@/components/polComponents/PolTableRow";
import PolText from "@/components/polComponents/PolText";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { cn } from "@/lib/utils";
import { RoleRateById } from "@/sdk/childEntities/RoleRateById";
import { Role } from "@/sdk/entities/billing/Role";
import { SubTask } from "@/sdk/entities/billing/SubTask";
import { Task } from "@/sdk/entities/billing/Task";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { User } from "@/sdk/entities/core/User";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { TimeActivitySideEditor } from "@/views/timesheet/timesheetReview/TimeActivitySideEditor";
import { useContext, useEffect, useState } from "react";
import { SelectedInvoiceContext } from "../contexts/SelectedInvoiceContext";

export function TimeActivityItem({ id, onDelete }: { onDelete: (id: string) => void; id: string }) {
  const request = useDbQueryFirst(TimeActivity, `WHERE c.id = "${id}"`);
  const workingPhaseRequest = useDbQueryFirst(WorkingPhase, `WHERE c.id = "${request.data?.WorkingPhaseId}"`, {
    enabled: isUsable(request.data),
  });
  const [roleRateIsDifferent, setRoleRateIsDifferent] = useState(false);
  const [currentRoleRate, setCurrentRoleRate] = useState<RoleRateById>(null);
  const [isSettingRate, setIsSettingRate] = useState(false);
  const [isDisplayOpen, setIsDisplayOpen] = useState(false);
  const { workingPhases } = useContext(SelectedInvoiceContext);
  const userRequest = useDbQueryFirst(User, `WHERE c.id = '${request.data?.UserId}'`, {
    enabled: isUsable(request.data),
  });
  const roleRequest = useDbQueryFirst(Role, `WHERE c.id = '${request.data?.RoleId}'`, {
    enabled: isUsable(request.data),
  });
  const taskRequest = useDbQueryFirst(Task, `WHERE c.id = '${request.data?.TaskId}'`, {
    enabled: isUsable(request.data),
  });
  const subtaskRequest = useDbQueryFirst(SubTask, `WHERE c.id = '${request.data?.SubTaskId}'`, {
    enabled: isUsable(request.data),
  });

  useEffect(() => {
    if (isUsable(workingPhaseRequest.data) === false) return;

    const roleRates = workingPhaseRequest.data.RoleRates;
    const newRate = roleRates.find((x) => x.RoleId == request.data.RoleId);
    setCurrentRoleRate(newRate ?? null);
    if (newRate?.Rate != request.data?.BillableRate) {
      setRoleRateIsDifferent(true);
    } else {
      setRoleRateIsDifferent(false);
    }
  }, [request.data, workingPhaseRequest.data]);

  const upsertRequest = useDbUpsert(TimeActivity);

  async function applyWorkingPhaseRate() {
    if (isUsable(request.data) === false) return;
    if (isUsable(workingPhaseRequest.data) === false) return;
    setIsSettingRate(true);
    const roleRates = workingPhaseRequest.data.RoleRates;
    const newRate = roleRates.find((x) => x.RoleId == request.data.RoleId);
    if (isUsable(newRate) === false) return;
    await upsertRequest.mutateAsync({ ...request.data, BillableRate: newRate.Rate });
    setIsSettingRate(false);
  }
  return (
    <PolRequestPresenter
      containerClassName="contents"
      request={request}
      onLoading={() => (
        <PolTableRow key={id}>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
        </PolTableRow>
      )}
      onSuccess={() => (
        <PolTableRow key={id}>
          <PolTableCell>
            <TimeActivityEditor timeActivity={request.data}></TimeActivityEditor>
          </PolTableCell>
          <PolTableCell>
            <PolText>{request.data.ActivityDate.format("MM-DD-YYYY")}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText className="truncate">
              {workingPhases.find((x) => x.id === request.data.WorkingPhaseId)?.DisplayName}
            </PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText>{getFullName(userRequest.data?.Person)}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText>{roleRequest.data?.Title}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText>{taskRequest.data?.Title}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText className="truncate">{subtaskRequest.data?.Title}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText>{request.data.Description}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText className="text-center">{request.data.Hours}</PolText>
          </PolTableCell>
          <PolTableCell>
            <div className="mx-auto flex">
              {request.data.BillableRate > 0 && roleRateIsDifferent === false ? (
                <></>
              ) : (
                <TooltipProvider delayDuration={50}>
                  <Tooltip open={isDisplayOpen} onOpenChange={(e) => setIsDisplayOpen(e)}>
                    <TooltipTrigger className="ml-auto" onClick={() => setIsDisplayOpen(true)}>
                      <PolIcon
                        name="AlertCircle"
                        className="mx-1 my-auto"
                        size="1rem"
                        stroke={roleRateIsDifferent ? "Yellow" : "Red"}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div>
                        {isUsable(currentRoleRate) ? (
                          <PolText type="muted">
                            {roleRateIsDifferent
                              ? `This time entry does not match the current billable rate of ${toUsdString(currentRoleRate?.Rate)}.`
                              : "This time entry seems to not have a billable rate."}
                            <a className="cursor-pointer text-blue-500" onClick={applyWorkingPhaseRate}>
                              {" "}
                              Try applying latest working phase rate ({toUsdString(currentRoleRate?.Rate)}) to this time
                              activity.
                            </a>
                          </PolText>
                        ) : (
                          <PolText type="muted">This role does not have a rate.</PolText>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <PolText className={cn("mx-auto text-center", isSettingRate ? "animate-pulse " : "")}>
                {toUsdString(request.data.BillableRate ?? 0)}
              </PolText>
            </div>
          </PolTableCell>
          <PolTableCell>
            <PolText className={cn("text-right")}>
              {toUsdString(request.data.BillableRate * request.data.Hours)}
            </PolText>
          </PolTableCell>

          <PolTableCell>
            <PolButton tooltip="Remove from invoice" variant="ghost" onClick={() => onDelete(id)}>
              <PolIcon name="ListX"></PolIcon>
            </PolButton>
          </PolTableCell>
        </PolTableRow>
      )}
    ></PolRequestPresenter>
  );
}

const TimeActivityEditor = ({ timeActivity }: { timeActivity: TimeActivity }) => {
  const [timeActivityState, setTimeActivityState] = useState([]);

  return (
    <>
      <PolButton
        tooltip="Edit time activity"
        variant="ghost"
        onClick={() =>
          setTimeActivityState((prev) => {
            if (prev?.length === 0) {
              return [timeActivity];
            } else {
              return [];
            }
          })
        }
      >
        <PolIcon name="PenLine"></PolIcon>
      </PolButton>

      {timeActivityState.length !== 0 && (
        <TimeActivitySideEditor
          isModal={true}
          onChange={setTimeActivityState}
          timeActivities={timeActivityState}
        ></TimeActivitySideEditor>
      )}
    </>
  );
};
