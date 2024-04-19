import { PolButton } from "@/components/polComponents/PolButton";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolHeading from "@/components/polComponents/PolHeading";
import PolInput from "@/components/polComponents/PolInput";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/customHooks/auth";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { Role } from "@/sdk/entities/billing/Role";
import { SubTask } from "@/sdk/entities/billing/SubTask";
import { Task } from "@/sdk/entities/billing/Task";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { Client } from "@/sdk/entities/project/Client";
import { Project } from "@/sdk/entities/project/Project";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { SelectedInvoiceContext } from "@/views/invoices/contexts/SelectedInvoiceContext";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { WeeklyHoursInput } from "./TimesheetReviewPage";
import { PolDropdown } from "@/components/polComponents/PolDropdown";
import { BillingStatus } from "@/sdk/enums/BillingStatus";
import { isOnInvoice } from "@/sdk/utils/billingStatusUtils";
import { update } from "node_modules/cypress/types/lodash";
const settableValues = [
  { label: "Billable", value: BillingStatus.Billable },
  { label: "Not Billable", value: BillingStatus.NotBillable },
];
const allValues = [
  { label: "Billable", value: BillingStatus.Billable },
  { label: "Not Billable", value: BillingStatus.NotBillable },
  { label: "On Invoice", value: BillingStatus.AddedToInvoice },
  { label: "Billed Elsewhere", value: BillingStatus.BilledElsewhere },
  { label: "Has been billed", value: BillingStatus.HasBeenBilled },
  { label: "Lump Sum", value: BillingStatus.LumpSum },
];

const propsToCheck = [
  "ClientId",
  "ProjectId",
  "WorkingPhaseId",
  "RoleId",
  "TaskId",
  "SubTaskId",
  "Description",
  "UserNotes",
  "AdminNotes",
  "BillingDetails.Status",
];

export const TimeActivitySideEditor = ({
  isModal,
  timeActivities,
  onChange,
}: {
  isModal: boolean;
  timeActivities?: TimeActivity[];
  onChange?: React.Dispatch<React.SetStateAction<TimeActivity[]>>;
}) => {
  const upsert = useDbUpsert(TimeActivity);
  const [open, setOpen] = useState(false);

  const [timeActivity, setTimeActivity] = useState<TimeActivity>(new TimeActivity());
  const [hasDuplicateDays, setHasDuplicateDays] = useState(false);

  useEffect(() => {
    if (timeActivities.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [timeActivities]);

  useEffect(() => {
    if (timeActivities.length === 1) {
      setTimeActivity(timeActivities[0]);
      return;
    }

    const newTimeActivity = createTimeActivity(timeActivities, propsToCheck);

    setTimeActivity(newTimeActivity);
  }, [timeActivities]);

  const multipleInputsValue = "---";
  const multipleInputsId = "---";

  function createTimeActivity(arr, properties) {
    let newTimeActivity = new TimeActivity();

    for (let property of properties) {
      let value = arr[0][property];

      let allEqual = arr.every((obj) => {
        return obj[property] === value;
      });

      newTimeActivity[property] = allEqual ? value : multipleInputsValue;
    }

    return newTimeActivity;
  }

  function handleOpenChange(open: boolean) {
    onChange([]);
    setOpen(open);
  }

  function handleChange(newProps: Partial<TimeActivity>) {
    setTimeActivity({ ...timeActivity, ...newProps });
  }
  function checkPropsAreSet(obj, properties) {
    return properties.every((prop) => obj[prop] !== multipleInputsValue);
  }

  function checkHasDuplicateDays(localTimeActivities: TimeActivity[]) {
    let dates = new Set();

    for (let activity of localTimeActivities) {
      if (dates.has(activity.ActivityDate)) {
        return true;
      }

      dates.add(activity.ActivityDate);
    }

    return false;
  }

  function getHours(localTimeActivities) {
    let newHours = [0, 0, 0, 0, 0, 0, 0];

    localTimeActivities.forEach((activity: TimeActivity) => {
      let dayOfWeek = activity.ActivityDate.weekday();

      newHours[dayOfWeek] += activity.Hours;
    });

    newHours = newHours.map((x) => (x === 0 ? null : x));

    return newHours;
  }
  const [hours, setHours] = useState([]);

  useEffect(() => {
    setHasDuplicateDays(checkHasDuplicateDays(timeActivities));
    setHours(getHours(timeActivities));
  }, [timeActivities]);

  const findSetProperties = (timeActivity, propertiesToCheck) => {
    const items = [];

    for (let key in propertiesToCheck) {
      const property = timeActivity[propertiesToCheck[key]];

      if (property !== "---") {
        items.push(propertiesToCheck[key]);
      }
    }

    return items;
  };

  const handleSave = () => {
    if (timeActivities.length === 1) {
      upsert.mutateAsync(timeActivity).then(() => {
        onChange([]);
        setOpen(false);
      });
      return;
    }

    const setProperties = findSetProperties(timeActivity, propsToCheck);

    let newTimeActivities = [...timeActivities];

    for (let activity of newTimeActivities) {
      for (let property of setProperties) {
        activity[property] = timeActivity[property];
      }
    }

    if (!hasDuplicateDays) {
      for (let activity of newTimeActivities) {
        let dayOfWeek = activity.ActivityDate.weekday();

        activity.Hours = hours[dayOfWeek];
      }
    }

    newTimeActivities.forEach((curr) => {
      upsert.mutateAsync(curr);
    });

    onChange([]);
    setOpen(false);
  };

  const { hasAccess } = useAuth();

  const hasAdminRights = hasAccess(AccessKeys.TimesheetAdmin);
  const { workingPhases: workingPhasesFromInvoice } = useContext(SelectedInvoiceContext);
  const workingPhaseRequest = useDbQuery(WorkingPhase, null, { enabled: isUsable(workingPhasesFromInvoice) });
  const clientsRequest = useDbQuery(Client);
  const projectRequest = useDbQuery(Project);
  const roleRequest = useDbQuery(Role);
  const taskRequest = useDbQuery(Task);
  const subtaskRequest = useDbQuery(SubTask);

  const [workingPhases, setWorkingPhases] = useState(workingPhasesFromInvoice);

  useEffect(() => {
    if (workingPhaseRequest.data) {
      setWorkingPhases(workingPhaseRequest.data);
    }
  }, [workingPhaseRequest.data]);

  const availableClients = useMemo(() => {
    if (isUsable(clientsRequest.data) === false) return [];
    const testClient = new Client();
    testClient.id = multipleInputsId;
    testClient.CompanyName = "---";
    return [
      ...clientsRequest.data?.filter((x) => hasAdminRights || x.ShowInTimesheet),
      !findSetProperties(timeActivity, propsToCheck).includes("ClientId") && testClient,
    ];
  }, [timeActivity.ClientId, timeActivity, clientsRequest.data]);

  const availableProjects = useMemo(() => {
    if (isUsable(projectRequest.data) === false) return [];
    const testProject = new Project();
    testProject.id = multipleInputsId;
    testProject.Nickname = "---";

    return [
      ...projectRequest.data?.filter(
        (x) =>
          (hasAdminRights || x.ShowInTimesheet) &&
          (isNullOrWhitespace(timeActivity.ClientId) || x.ClientId == timeActivity.ClientId),
      ),
      !findSetProperties(timeActivity, propsToCheck).includes("ProjectId") && testProject,
    ];
  }, [timeActivity.ClientId, timeActivity, projectRequest.data]);

  const availableWorkingPhases = useMemo(() => {
    if (isUsable(workingPhases) === false) return [];
    const testWorkingPhase = new WorkingPhase();
    testWorkingPhase.id = multipleInputsId;
    testWorkingPhase.DisplayName = "---";

    return [
      ...workingPhases?.filter((x) => x.ProjectId === timeActivity.ProjectId && (hasAdminRights || x.ShowInTimesheet)),
      !findSetProperties(timeActivity, propsToCheck).includes("WorkingPhaseId") && testWorkingPhase,
    ];
  }, [timeActivity.ProjectId, timeActivity, workingPhases]);

  const availableRoles = useMemo(() => {
    if (isUsable(roleRequest.data) === false) return [];
    if (isUsable(workingPhases) === false) return [];

    const testRole = new Role();
    testRole.id = multipleInputsId;
    testRole.Title = "---";

    let workingPhaseId = timeActivity.WorkingPhaseId;
    if (workingPhaseId === multipleInputsId) {
      const phaseActivityBucketIds = new Set(
        timeActivities.map((x) => workingPhases.find((w) => w.id === x.WorkingPhaseId).PhaseActivityBucketId),
      );
      if (phaseActivityBucketIds.size === 1) {
        workingPhaseId = timeActivities.map((x) => workingPhases.find((w) => w.id === x.WorkingPhaseId))[0].id;
      }
    }

    return [
      ...roleRequest.data?.filter(
        (x) =>
          x.PhaseActivityBucketId ===
          workingPhases.find((x) => x.id == workingPhaseId && (hasAdminRights || x.ShowInTimesheet))
            ?.PhaseActivityBucketId,
      ),
      !findSetProperties(timeActivity, propsToCheck).includes("RoleId") && testRole,
    ];
  }, [timeActivity.WorkingPhaseId, timeActivity, roleRequest.data, workingPhases]);

  const availableTasks = useMemo(() => {
    if (isUsable(taskRequest.data) === false) return [];

    const isRoleInAvailableRoles = availableRoles.map((x) => x.id).includes(timeActivity.RoleId);
    const testTask = new Task();
    testTask.id = multipleInputsId;
    testTask.Title = "---";
    return [
      ...taskRequest.data?.filter((x) => x.RoleId === timeActivity.RoleId && (hasAdminRights || x.ShowInTimesheet)),
      !findSetProperties(timeActivity, propsToCheck).includes("TaskId") && testTask,
    ];
  }, [timeActivity.RoleId, timeActivity, taskRequest.data]);

  const availableSubtasks = useMemo(() => {
    if (isUsable(subtaskRequest.data) === false) return [];

    const isTaskInAvailableTasks = availableTasks.map((x) => x.id).includes(timeActivity.TaskId);

    const testSubTask = new SubTask();
    testSubTask.id = multipleInputsId;
    testSubTask.Title = "---";
    return [
      ...subtaskRequest.data?.filter((x) => x.TaskId === timeActivity.TaskId && (hasAdminRights || x.ShowInTimesheet)),
      !findSetProperties(timeActivity, propsToCheck).includes("SubTaskId") && testSubTask,
    ];
  }, [timeActivity.SubTaskId, timeActivity, subtaskRequest.data]);

  return (
    <Sheet modal={isModal} open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        className="max-h-screen w-[32rem] overflow-auto"
        onOpenAutoFocus={(x) => x.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>
            <PolHeading size={1}>Edit</PolHeading>
          </SheetTitle>
        </SheetHeader>
        <PolRequestPresenter
          request={[clientsRequest, projectRequest, roleRequest, taskRequest, subtaskRequest]}
          onLoading={() => (
            <div className="grid grid-flow-row space-y-5">
              <PolSkeleton className="h-12 w-[32rem]" />
              <PolSkeleton className="h-12 w-[32rem]" />
              <PolSkeleton className="h-12 w-[32rem]" />
              <PolSkeleton className="h-12 w-[32rem]" />
              <PolSkeleton className="h-12 w-[32rem]" />
              <PolSkeleton className="h-12 w-[32rem]" />
            </div>
          )}
          onSuccess={() => (
            <div className="grid gap-4 py-4">
              <PolEntityDropdown
                nameGetter={(x) => {
                  return x.CompanyName;
                }}
                label="Client"
                options={availableClients}
                selectedId={timeActivity.ClientId}
                onValueChanged={(x) => handleChange({ ClientId: x.id })}
                itemTemplate={(x) => <div className={x.ShowInTimesheet ? "" : "text-text-300"}>{x.DisplayName}</div>}
              ></PolEntityDropdown>
              <PolEntityDropdown
                nameGetter={(x) => x.Nickname}
                label="Project"
                options={[...availableProjects]}
                selectedId={timeActivity.ProjectId}
                onValueChanged={(x) => handleChange({ ProjectId: x.id })}
                itemTemplate={(x) => <div className={x.ShowInTimesheet ? "" : "text-text-300"}>{x.Nickname}</div>}
              ></PolEntityDropdown>
              <PolEntityDropdown
                label="Working Phase"
                options={availableWorkingPhases}
                nameGetter={(x) => x.DisplayName}
                selectedId={timeActivity.WorkingPhaseId}
                onValueChanged={(x) => handleChange({ WorkingPhaseId: x.id })}
                itemTemplate={(x) => <div className={x.ShowInTimesheet ? "" : "text-text-300"}>{x.DisplayName}</div>}
              ></PolEntityDropdown>
              <PolEntityDropdown
                label="Role"
                options={availableRoles}
                nameGetter={(x) => x.Title}
                selectedId={timeActivity.RoleId}
                onValueChanged={(x) => handleChange({ RoleId: x.id })}
                itemTemplate={(x) => <div className={x.ShowInTimesheet ? "" : "text-text-300"}>{x.Title}</div>}
              ></PolEntityDropdown>
              <PolEntityDropdown
                label="Task"
                options={availableTasks}
                nameGetter={(x) => x.Title}
                selectedId={timeActivity.TaskId}
                onValueChanged={(x) => handleChange({ TaskId: x.id })}
                itemTemplate={(x) => <div className={x.ShowInTimesheet ? "" : "text-text-300"}>{x.Title}</div>}
              ></PolEntityDropdown>
              <PolEntityDropdown
                label="Sub Task"
                options={availableSubtasks}
                nameGetter={(x) => x.Title}
                selectedId={timeActivity.SubTaskId}
                onValueChanged={(x) => handleChange({ SubTaskId: x.id })}
                itemTemplate={(x) => <div className={x.ShowInTimesheet ? "" : "text-text-300"}>{x.Title}</div>}
              ></PolEntityDropdown>
              <PolInput
                label="Description"
                value={timeActivity.Description}
                onValueChanged={(x) => handleChange({ Description: x })}
              ></PolInput>
              <PolInput
                label="User Notes"
                value={timeActivity.UserNotes}
                onValueChanged={(x) => handleChange({ UserNotes: x })}
              ></PolInput>
              <PolInput
                label="Admin Notes"
                value={timeActivity.AdminNotes}
                onValueChanged={(x) => handleChange({ AdminNotes: x })}
              ></PolInput>
              <div className="flex flex-col">
                <PolCheckbox
                  value={timeActivity.HasRequestVerification}
                  onValueChanged={(x) => handleChange({ HasRequestVerification: x })}
                >
                  Has Request Verification
                </PolCheckbox>
                <PolCheckbox
                  value={timeActivity.HasRequestBillableChange}
                  onValueChanged={(x) => handleChange({ HasRequestBillableChange: x })}
                >
                  Has Request Billable Change
                </PolCheckbox>
              </div>

              {timeActivities.length === 1 && (
                <PolDropdown
                  isSearchable={false}
                  isDisabled={isOnInvoice(timeActivity.BillingDetails.Status)}
                  containerClassName="flex-grow"
                  placeHolder="Select"
                  nameGetter={(x) => x.label}
                  options={isOnInvoice(timeActivity.BillingDetails.Status) ? allValues : settableValues}
                  label="Billing Status"
                  value={
                    allValues.find((i) => i.value === timeActivity.BillingDetails.Status) ?? {
                      label: BillingStatus[timeActivity.BillingDetails.Status],
                      value: timeActivity.BillingDetails.Status,
                    }
                  }
                  onValueChanged={(x) =>
                    handleChange({ BillingDetails: { ...timeActivity.BillingDetails, Status: x.value } })
                  }
                ></PolDropdown>
              )}
              {timeActivities.length === 1 && (
                <PolInput
                  type="number"
                  label="Hours"
                  value={timeActivity.Hours}
                  onValueChanged={(x) => handleChange({ Hours: x })}
                ></PolInput>
              )}
              {!hasDuplicateDays && timeActivities.length > 1 && checkPropsAreSet(timeActivity, propsToCheck) && (
                <WeeklyHoursInput values={hours} setValues={setHours}></WeeklyHoursInput>
              )}
              {hasDuplicateDays && timeActivities.length > 1 && (
                <p className="text-red-500">Cannot modify hours with duplicate Activity Dates selected</p>
              )}
              <PolButton onClick={handleSave}>Save</PolButton>
            </div>
          )}
        />
      </SheetContent>
    </Sheet>
  );
};
