import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolInput from "@/components/polComponents/PolInput";
import PolTableCell from "@/components/polComponents/PolTableCell";
import PolTableRow from "@/components/polComponents/PolTableRow";
import { TimeActivityDropdownContext } from "@/contexts/TimeActivityDropdownContext";
import { useAuth } from "@/customHooks/auth";
import { Client } from "@/sdk/entities/project/Client";
import { Project } from "@/sdk/entities/project/Project";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import { TimeBlock } from "@/sdk/models/TimeBlock";
import { Role } from "@sdk/./entities/billing/Role";
import { SubTask } from "@sdk/./entities/billing/SubTask";
import { Task } from "@sdk/./entities/billing/Task";
import { TimeActivity } from "@sdk/./entities/billing/TimeActivity";
import { tryGetSum } from "@sdk/./utils/arrayUtils";
import { isNullOrWhitespace } from "@sdk/./utils/stringUtils";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import moment, { Moment } from "moment/moment";
import React, { useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useState } from "react";
import AutoCompleteDescription from "./AutoCompleteDescription";
import { deepEquals } from "@/sdk/utils/equalityUtils";
import PolText from "@/components/polComponents/PolText";
import { Dropdown } from "flowbite-react";
import { BillingStatus } from "@/sdk/enums/BillingStatus";
import { Label } from "@/components/ui/label";

interface Props {
  item: TimeBlock;
  index: number;
  weekOf: Moment;
  currentUserId: string;
  onTimeActivitiesUpdated: (timeActivities: TimeActivity[]) => void | Promise<void>;
  onTimeActivitiesRemoved: (timeActivities: TimeActivity[], deleteButtonPressed: boolean) => void | Promise<void>;
  onTimeActivitiesAdded: (timeActivities: TimeActivity[]) => void | Promise<void>;
}
export const TimeBlockTableRow = ({
  index,
  item,
  weekOf,
  onTimeActivitiesUpdated,
  onTimeActivitiesAdded,
  onTimeActivitiesRemoved,
  currentUserId,
}: Props) => {
  const { user, hasAccess } = useAuth();
  const hasAdminRights = hasAccess(AccessKeys.TimesheetAdmin);

  const [timeBlock, setTimeblock] = useState<TimeBlock>(new TimeBlock());

  useLayoutEffect(() => {
    setTimeblock({ ...item });
  }, [item]);

  const times = useMemo(
    () => [
      timeBlock.Sunday,
      timeBlock.Monday,
      timeBlock.Tuesday,
      timeBlock.Wednesday,
      timeBlock.Thursday,
      timeBlock.Friday,
      timeBlock.Saturday,
    ],
    [timeBlock],
  );
  const refItem = timeBlock.Ref;

  const [clientId, setClientId] = useState(refItem?.ClientId ?? "");
  const [projectId, setProjectId] = useState(refItem?.ProjectId ?? "");
  const [workingPhaseId, setWorkingPhaseId] = useState(refItem?.WorkingPhaseId ?? "");
  const [roleId, setRoleId] = useState(refItem?.RoleId ?? "");
  const [taskId, setTaskId] = useState(refItem?.TaskId ?? "");
  const [subtaskId, setSubtaskId] = useState(refItem?.SubTaskId ?? "");
  const [description, setDescription] = useState(refItem?.Description ?? "");
  const [hasBillableChange, setHasBillableChange] = useState(refItem?.HasRequestBillableChange ?? false);
  const [HasRequestVerification, setHasRequestVerification] = useState(refItem?.HasRequestVerification ?? false);

  const state = [
    clientId,
    projectId,
    workingPhaseId,
    roleId,
    taskId,
    subtaskId,
    description,
    hasBillableChange,
    HasRequestVerification,
  ];

  useEffect(() => {
    if (isUsable(refItem) === false) return;
    setClientId(refItem?.ClientId ?? "");
    setProjectId(refItem?.ProjectId ?? "");
    setWorkingPhaseId(refItem?.WorkingPhaseId ?? "");
    setRoleId(refItem?.RoleId ?? "");
    setTaskId(refItem?.TaskId ?? "");
    setSubtaskId(refItem?.SubTaskId ?? "");
    setDescription(refItem?.Description ?? "");
    setHasBillableChange(refItem?.HasRequestBillableChange ?? false);
    setHasRequestVerification(refItem?.HasRequestVerification ?? false);
  }, [refItem]);

  const updateTimeBlock = useCallback(
    async (timeUpdates: Partial<TimeActivity>) => {
      const newItems = times
        .filter((x) => isUsable(x))
        .map((timeActivity) => {
          Object.assign(timeActivity, timeUpdates);
          return timeActivity;
        });

      if (newItems.length > 0 && isUsable(onTimeActivitiesUpdated)) {
        await onTimeActivitiesUpdated(newItems.map((x) => ({ ...x })));
      } else {
        const timeActivity = new TimeActivity();
        timeActivity.ClientId = clientId;
        timeActivity.ProjectId = projectId;
        timeActivity.WorkingPhaseId = workingPhaseId;
        timeActivity.RoleId = roleId;
        timeActivity.TaskId = taskId;
        timeActivity.SubTaskId = subtaskId;
        timeActivity.Description = description;
        timeActivity.HasRequestBillableChange = hasBillableChange;
        timeActivity.HasRequestVerification = HasRequestVerification;
        Object.assign(timeActivity, timeUpdates);

        setClientId(timeActivity.ClientId);
        setProjectId(timeActivity.ProjectId);
        setWorkingPhaseId(timeActivity.WorkingPhaseId);
        setRoleId(timeActivity.RoleId);
        setTaskId(timeActivity.TaskId);
        setSubtaskId(timeActivity.SubTaskId);
        setDescription(timeActivity.Description);
        setHasBillableChange(timeActivity.HasRequestBillableChange);
        setHasRequestVerification(timeActivity.HasRequestVerification);
      }
    },
    [
      times,
      onTimeActivitiesUpdated,
      clientId,
      projectId,
      workingPhaseId,
      roleId,
      taskId,
      subtaskId,
      description,
      hasAdminRights,
      hasBillableChange,
    ],
  );

  const timeActivityDropdowns = useContext(TimeActivityDropdownContext);

  const availableClients = useMemo(
    () => timeActivityDropdowns.Clients.filter((x) => hasAdminRights || x.ShowInTimesheet),
    [clientId, timeActivityDropdowns.Projects],
  );
  const availableProjects = useMemo(
    () => timeActivityDropdowns.Projects.filter((x) => hasAdminRights || x.ShowInTimesheet),
    [clientId, timeActivityDropdowns.Projects],
  );
  const availableWorkingPhases = useMemo(
    () =>
      timeActivityDropdowns.WorkingPhases?.filter(
        (x) => x.ProjectId === projectId && (hasAdminRights || x.ShowInTimesheet),
      ),
    [projectId, timeActivityDropdowns.WorkingPhases],
  );
  const availableRoles = useMemo(
    () =>
      timeActivityDropdowns.Roles?.filter(
        (x) =>
          x.PhaseActivityBucketId ===
          timeActivityDropdowns.WorkingPhases.find(
            (x) => x.id == workingPhaseId && (hasAdminRights || x.ShowInTimesheet),
          )?.PhaseActivityBucketId,
      ),
    [workingPhaseId, timeActivityDropdowns.WorkingPhases, timeActivityDropdowns.Roles],
  );
  const availableTasks = useMemo(
    () => timeActivityDropdowns.Tasks?.filter((x) => x.RoleId === roleId && (hasAdminRights || x.ShowInTimesheet)),
    [roleId, timeActivityDropdowns.Tasks],
  );
  const availableSubtasks = useMemo(
    () => timeActivityDropdowns.SubTasks?.filter((x) => x.TaskId === taskId && (hasAdminRights || x.ShowInTimesheet)),
    [taskId, timeActivityDropdowns.SubTasks],
  );

  useEffect(() => {
    let isUpdate = false;
    let updateObject: Partial<TimeActivity> = {};
    if (isNullOrWhitespace(projectId)) return;
    let newClientId = availableProjects.find((i) => i.id === projectId)?.ClientId ?? "";
    if (newClientId !== clientId) {
      updateObject = { ClientId: newClientId };
      isUpdate = true;
    }

    if (isNullOrWhitespace(newClientId)) return;
    if (isNullOrWhitespace(projectId)) return;

    const newProjectId = availableProjects.find((i) => i.id === projectId && i.ClientId === newClientId)?.id ?? "";

    if (newProjectId !== projectId) {
      updateObject = { ...updateObject, ProjectId: newProjectId };
      isUpdate = true;
    }
    if (deepEquals(updateObject, {}) === false) {
      updateTimeBlock(updateObject);
    }
  }, [projectId, clientId, availableProjects]);

  const onHoursChanged = (timeItem: TimeActivity | undefined, hours: number, dayOfWeek: number) => {
    const hasHours = hours > 0 && isUsable(hours);
    if (hasHours === false && isUsable(timeItem)) {
      onTimeActivitiesRemoved([timeItem], false);
      if (timeItem === timeBlock.Sunday) {
        setTimeblock((x) => ({ ...x, Sunday: null }));
      } else if (timeItem === timeBlock.Monday) {
        setTimeblock((x) => ({ ...x, Monday: null }));
      } else if (timeItem === timeBlock.Tuesday) {
        setTimeblock((x) => ({ ...x, Tuesday: null }));
      } else if (timeItem === timeBlock.Wednesday) {
        setTimeblock((x) => ({ ...x, Wednesday: null }));
      } else if (timeItem === timeBlock.Thursday) {
        setTimeblock((x) => ({ ...x, Thursday: null }));
      } else if (timeItem === timeBlock.Friday) {
        setTimeblock((x) => ({ ...x, Friday: null }));
      } else if (timeItem === timeBlock.Saturday) {
        setTimeblock((x) => ({ ...x, Saturday: null }));
      }
      return;
    }
    if (hasHours === false) return;
    if (isUsable(timeItem) === false) {
      timeItem = new TimeActivity();
      timeItem.ActivityDate = moment(weekOf).add(dayOfWeek, "days").startOf("day");
      timeItem.ClientId = clientId;
      timeItem.ProjectId = projectId;
      timeItem.WorkingPhaseId = workingPhaseId;
      timeItem.RoleId = roleId;
      timeItem.TaskId = taskId;
      timeItem.SubTaskId = subtaskId;
      timeItem.Description = description;
      timeItem.HasRequestBillableChange = hasBillableChange;
      timeItem.HasRequestVerification = HasRequestVerification;
      timeItem.Hours = hours;
      onTimeActivitiesAdded([timeItem]);
    } else {
      onTimeActivitiesUpdated([{ ...timeItem, Hours: hours }]);
    }
  };

  const onDelete = () => {
    const timesToDelete = times.filter((x) => isUsable(x));
    if (timesToDelete.length > 0) {
      return onTimeActivitiesRemoved(timesToDelete, true);
    } else {
      setClientId("");
      setProjectId("");
      setWorkingPhaseId("");
      setRoleId("");
      setTaskId("");
      setSubtaskId("");
      setDescription("");
      setHasBillableChange(false);
      setHasRequestVerification(false);
    }
  };

  const onClientChanged = useCallback((value) => {
    updateTimeBlock({ ClientId: value?.id ?? "" });
  }, state);
  const onProjectChanged = useCallback((value) => {
    updateTimeBlock({ ProjectId: value?.id ?? "" });
  }, state);
  const onWorkingPhaseChanged = useCallback((value) => {
    updateTimeBlock({ WorkingPhaseId: value?.id ?? "" });
  }, state);

  const OnRoleChanged = useCallback((value) => {
    updateTimeBlock({ RoleId: value?.id ?? "" });
  }, state);

  const OnTaskChanged = useCallback((value) => {
    updateTimeBlock({ TaskId: value?.id ?? "" });
  }, state);

  const OnSubTaskChanged = useCallback((value) => {
    updateTimeBlock({ SubTaskId: value?.id ?? "" });
  }, state);

  const GetTitle = useCallback((x) => {
    return x.Title;
  }, []);

  const getDisplayName = useCallback((x) => {
    return x.DisplayName;
  }, []);

  const getNickname = useCallback((x) => {
    const client = timeActivityDropdowns.Clients.find((i) => i.id == x.ClientId);
    return (
      (isNullOrWhitespace(client?.Abbreviation) === false ? client.Abbreviation : client.DisplayName) +
      ": " +
      x.Nickname
    );
  }, []);

  const id = useId();

  async function pasteDropdown() {
    const copiedState = JSON.parse(await navigator.clipboard.readText());

    if ("ProjectId" in copiedState) {
      setProjectId(copiedState.ProjectId);
    }

    if ("WorkingPhaseId" in copiedState) {
      setWorkingPhaseId(copiedState.WorkingPhaseId);
    }

    if ("RoleId" in copiedState) {
      setRoleId(copiedState.RoleId);
    }

    if ("TaskId" in copiedState) {
      setTaskId(copiedState.TaskId);
    }

    if ("SubTaskId" in copiedState) {
      setSubtaskId(copiedState.SubTaskId);
    }

    if ("Description" in copiedState) {
      setDescription(copiedState.Description);
    }
  }
  async function copyDropdowns() {
    await navigator.clipboard.writeText(
      JSON.stringify({
        ProjectId: projectId,
        WorkingPhaseId: workingPhaseId,
        RoleId: roleId,
        TaskId: taskId,
        SubTaskId: subtaskId,
        Description: description,
      }),
    );
  }

  const isDisabled =
    isNullOrWhitespace(clientId) != false &&
    isNullOrWhitespace(projectId) != false &&
    isNullOrWhitespace(workingPhaseId) != false &&
    isNullOrWhitespace(roleId) != false &&
    isNullOrWhitespace(taskId) != false;
  return (
    <>
      <PolTableRow key={id} className="hidden md:table-row">
        <PolTableCell>
          <div className="grid h-full grid-flow-row grid-rows-3">
            <div className="ml-0 mr-auto w-min">
              <Dropdown
                className="z-[10000] items-start"
                arrowIcon={false}
                inline
                label={<PolIcon name="MoreVertical"></PolIcon>}
              >
                <Dropdown.Item className="rounded-t-lg" onClick={copyDropdowns}>
                  Copy
                </Dropdown.Item>
                <Dropdown.Item className="rounded-b-lg" onClick={pasteDropdown}>
                  Paste
                </Dropdown.Item>
              </Dropdown>
            </div>

            <PolText className="text-center">{index + 1}</PolText>
            {(refItem.BillingDetails.Status === BillingStatus.Billable ||
              refItem.BillingDetails.Status === BillingStatus.HasBeenBilled) && (
              <PolIcon
                hintText="Is Billable"
                name="CircleDollarSign"
                size="1.3rem"
                className="mx-auto"
                stroke={
                  refItem.BillingDetails.Status === BillingStatus.HasBeenBilled && hasAdminRights
                    ? "rgb(250 204 21)"
                    : "rgb(22 101 52)"
                }
              />
            )}
          </div>
        </PolTableCell>
        <PolTableCell>
          <div>
            <div className=" flex w-full flex-row flex-wrap">
              <PolEntityDropdown<Project>
                data-testid="project-dropdown"
                className="m-2 min-w-[15rem] flex-grow"
                options={availableProjects}
                selectedId={projectId}
                onValueChanged={onProjectChanged}
                placeHolder="Project"
                nameGetter={getNickname}
                itemTemplate={useCallback(
                  (x) => (
                    <div className="grid grid-flow-row">
                      <PolText className={x.ShowInTimesheet ? "" : "text-text-300 dark:text-text-500"}>
                        {x.Nickname}
                      </PolText>
                      <PolText type="muted" className={x.ShowInTimesheet ? "" : "text-text-300 dark:text-text-500"}>
                        {timeActivityDropdowns.Clients.find((i) => i.id == x.ClientId)?.DisplayName}
                      </PolText>
                    </div>
                  ),
                  [],
                )}
              />
              <PolEntityDropdown<WorkingPhase>
                data-testid="workingphase-dropdown"
                className="m-2 min-w-[20rem] flex-grow"
                options={availableWorkingPhases}
                selectedId={workingPhaseId}
                onValueChanged={onWorkingPhaseChanged}
                placeHolder="Working Phase"
                nameGetter={getDisplayName}
                itemTemplate={useCallback(
                  (x) => (
                    <div className={x.ShowInTimesheet ? "" : "text-text-300 dark:text-text-700"}>{x.DisplayName}</div>
                  ),
                  [],
                )}
              />
              <PolEntityDropdown<Role>
                data-testid="role-dropdown"
                className="m-2 min-w-[15rem] flex-grow"
                options={availableRoles}
                selectedId={roleId}
                onValueChanged={OnRoleChanged}
                placeHolder="Role"
                nameGetter={GetTitle}
                itemTemplate={useCallback(
                  (x) => (
                    <div className={x.ShowInTimesheet ? "" : "text-text-300 dark:text-text-700"}>{x.Title}</div>
                  ),
                  [],
                )}
              />
              <PolEntityDropdown<Task>
                data-testid="task-dropdown"
                className="m-2 min-w-[15rem] flex-grow"
                options={availableTasks}
                selectedId={taskId}
                onValueChanged={OnTaskChanged}
                placeHolder="Task"
                nameGetter={GetTitle}
                itemTemplate={useCallback(
                  (x) => (
                    <div className={x.ShowInTimesheet ? "" : "text-text-300 dark:text-text-700"}>{x.Title}</div>
                  ),
                  [],
                )}
              />
              <PolEntityDropdown<SubTask>
                data-testid="subtask-dropdown"
                className=" m-2 min-w-[15rem]"
                options={availableSubtasks}
                selectedId={subtaskId}
                onValueChanged={OnSubTaskChanged}
                placeHolder="Sub Task"
                nameGetter={GetTitle}
                itemTemplate={useCallback(
                  (x) => (
                    <div className={x.ShowInTimesheet ? "" : "text-text-300 dark:text-text-700"}>{x.Title}</div>
                  ),
                  state,
                )}
              />
              <AutoCompleteDescription
                currentUserId={currentUserId}
                description={description}
                updateTimeBlock={updateTimeBlock}
              />

              <div className="grid grid-flow-col gap-5">
                <PolCheckbox
                  value={hasBillableChange}
                  onValueChanged={React.useCallback(
                    (value) =>
                      updateTimeBlock({
                        HasRequestBillableChange: value,
                      }),
                    state,
                  )}
                >
                  Request Billable Change
                </PolCheckbox>
                <PolCheckbox
                  value={HasRequestVerification}
                  onValueChanged={React.useCallback(
                    (value) =>
                      updateTimeBlock({
                        HasRequestVerification: value,
                      }),
                    state,
                  )}
                >
                  Request Verification
                </PolCheckbox>
              </div>
            </div>
          </div>
        </PolTableCell>
        <PolTableCell>
          <HoursInput
            timeActivity={timeBlock.Sunday}
            isDisabled={isDisabled}
            onHoursChanged={onHoursChanged}
            dayOfWeek={0}
          />
        </PolTableCell>
        <PolTableCell>
          <HoursInput
            timeActivity={timeBlock.Monday}
            isDisabled={isDisabled}
            onHoursChanged={onHoursChanged}
            dayOfWeek={1}
          />
        </PolTableCell>
        <PolTableCell>
          <HoursInput
            timeActivity={timeBlock.Tuesday}
            isDisabled={isDisabled}
            onHoursChanged={onHoursChanged}
            dayOfWeek={2}
          />
        </PolTableCell>
        <PolTableCell>
          <HoursInput
            timeActivity={timeBlock.Wednesday}
            isDisabled={isDisabled}
            onHoursChanged={onHoursChanged}
            dayOfWeek={3}
          />
        </PolTableCell>
        <PolTableCell>
          <HoursInput
            timeActivity={timeBlock.Thursday}
            isDisabled={isDisabled}
            onHoursChanged={onHoursChanged}
            dayOfWeek={4}
          />
        </PolTableCell>
        <PolTableCell>
          <HoursInput
            timeActivity={timeBlock.Friday}
            isDisabled={isDisabled}
            onHoursChanged={onHoursChanged}
            dayOfWeek={5}
          />
        </PolTableCell>
        <PolTableCell>
          <HoursInput
            timeActivity={timeBlock.Saturday}
            isDisabled={isDisabled}
            onHoursChanged={onHoursChanged}
            dayOfWeek={6}
          />
        </PolTableCell>
        <PolTableCell>
          <PolText className="text-center">{tryGetSum(times.map((x) => x?.Hours ?? 0))}</PolText>
        </PolTableCell>

        <PolTableCell>
          <PolButton data-testid="deleteButton" variant="ghost" onClick={onDelete}>
            <PolIcon name="Trash2" />
          </PolButton>
        </PolTableCell>
      </PolTableRow>
    </>
  );
};

interface HoursInputProps {
  timeActivity: TimeActivity;
  isDisabled: boolean;
  dayOfWeek: number;
  onHoursChanged: (timeItem: TimeActivity | undefined, hours: number, dayOfWeek: number) => void;
}

function HoursInput({ timeActivity, isDisabled, dayOfWeek, onHoursChanged }: HoursInputProps) {
  const [hours, setHours] = useState(timeActivity?.Hours || "");

  useEffect(() => {
    setHours(timeActivity?.Hours || "");
  }, [timeActivity?.Hours]);

  return (
    <PolInput
      className="text-center"
      data-testid={`hours-input-${dayOfWeek}`}
      value={hours}
      isDisabled={isDisabled}
      valueChangeOn="change"
      onBlur={useCallback(() => {
        console.log("time blur");
        let value = Math.max(Math.min(Number(hours), 24), 0);
        if (value > 0) {
        } else {
          setHours("");
          value = 0;
        }
        value !== timeActivity?.Hours && onHoursChanged(timeActivity, Number(value), dayOfWeek);
      }, [timeActivity, hours, dayOfWeek, onHoursChanged])}
      onValueChanged={(value) => setHours(value)}
    />
  );
}
