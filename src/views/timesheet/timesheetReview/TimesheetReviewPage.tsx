import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolDropdown } from "@/components/polComponents/PolDropdown";
import PolHeading from "@/components/polComponents/PolHeading";
import PolInput from "@/components/polComponents/PolInput";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSwitch from "@/components/polComponents/PolSwitch";
import { useAuth } from "@/customHooks/auth";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { Role } from "@/sdk/entities/billing/Role";
import { SubTask } from "@/sdk/entities/billing/SubTask";
import { Task } from "@/sdk/entities/billing/Task";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { UserTimesheet } from "@/sdk/entities/billing/UserTimesheet";
import { NotificationGroupUser } from "@/sdk/entities/core/NotificationGroup";
import { User } from "@/sdk/entities/core/User";
import { Client } from "@/sdk/entities/project/Client";
import { Project } from "@/sdk/entities/project/Project";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { NotificationType } from "@/sdk/enums/NotificationType";
import { addDays } from "@/sdk/utils/dateUtils";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import ReactDataGrid from "@inovua/reactdatagrid-enterprise";
import "@inovua/reactdatagrid-enterprise/base.css";
import moment, { Moment } from "moment";
import React, { useCallback, useState } from "react";
import "../../../dataGridTheme.scss";
import { TimeActivitySideEditor } from "./TimeActivitySideEditor";
function getAllSundaysOfLastMonths(daysBack: number, daysForward: number): Moment[] {
  let endDate = moment().add(daysForward, "days");
  let startDate = moment().add(-1 * daysBack, "days");

  const sundays = [];
  // Find the first Sunday
  while (startDate.day() !== 0) {
    startDate = startDate.add(1, "days");
  }

  // Iterate to get all Sundays until the end date
  while (startDate.isSameOrBefore(endDate)) {
    sundays.push(startDate.clone());
    startDate = startDate.add(7, "days");
  }

  return sundays;
}
const weekOfs = getAllSundaysOfLastMonths(180, 30);

function getLastSunday(searchDate: Moment): Moment {
  let lastSunday = null;

  for (const date of weekOfs) {
    if (date.day() === 0 && date <= searchDate) {
      if (!lastSunday || searchDate > lastSunday) {
        lastSunday = date;
      }
    }
  }

  return lastSunday;
}

function formatDateWithDash(date: Moment): string {
  if (isUsable(date) === false) return null;

  let month = "" + (date.month() + 1);
  let day = "" + date.date();
  const year = date.year();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day, year].join("-");
}

function formatDateWithoutDash(date: Moment): string {
  if (isUsable(date) === false) return null;

  let month = "" + (date.month() + 1);
  let day = "" + date.date();
  const year = date.year();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day, year].join("");
}

function getWeekFromId(weekId: string): Moment {
  if (weekId == "thisWeek") {
    return moment();
  }
  if (weekId == "lastWeek") {
    const date = moment();
    date.add(-7, "days");
    return date;
  }
  try {
    return parseDate(weekId);
  } catch {
    return moment();
  }
}

function getIdFromDate(currentMoment: Moment): string {
  return currentMoment.format("YYYY-MM-DD");
}

// function getIdFromDate(currentMoment: Moment): string {
//   const now = moment();
//   const thisWeek = now.week();
//   const inputWeek = (currentMoment ?? moment()).week();

//   if (inputWeek === thisWeek) {
//     return "thisWeek";
//   } else if (inputWeek === thisWeek - 1) {
//     return "lastWeek";
//   } else {
//     return formatDateWithoutDash(currentMoment);
//   }
// }

function getWeekLabel(date: Moment): string {
  const isThisWeek = date.week() === moment().week();
  if (isThisWeek) {
    return "This Week";
  }
  const isLastWeek = date.week() === moment().add(-7, "days").week();
  if (isLastWeek) {
    return "Last Week";
  }
  const nextWeek = addDays(moment(date), 7);
  return `${date.month() + 1}/${date.date()}/${date.year()} - ${
    nextWeek.month() + 1
  }/${nextWeek.date()}/${nextWeek.year()}`;
}

function parseDate(dateString: string): Moment {
  const year = dateString.substring(4, 8);
  const month = dateString.substring(0, 2);
  const day = dateString.substring(2, 4);

  return moment.utc(`${year}-${month}-${day}`);
}
export default function TimesheetReviewPage() {
  const [weekStartOf, setWeekStartOf] = useSearchParamState("selectedWeekId", "thisWeek");
  const [weekSelected, setWeekSelected] = useState(() => getLastSunday(getWeekFromId(weekStartOf)));
  const userTimesheetRequest = useDbQuery(
    UserTimesheet,
    `WHERE c.WeeklyTimesheetId IN ["${getIdFromDate(weekSelected)}"]`,
    {
      enabled: isUsable(weekSelected),
    },
  );
  const roleRequest = useDbQuery(Role);
  const clientRequest = useDbQuery(Client);
  const projectRequest = useDbQuery(Project);
  const workingPhaseRequest = useDbQuery(WorkingPhase);
  const taskRequest = useDbQuery(Task);
  const subTasksRequest = useDbQuery(SubTask);
  const usersRequest = useDbQuery(User);

  const { user } = useAuth();
  const upsertGroupUser = useDbUpsert(NotificationGroupUser);
  const deleteGroupUser = useDbDelete(NotificationGroupUser);
  const isCertitiedRequest = useDbQueryFirst(
    NotificationGroupUser,
    `WHERE c.UserId = "${user.id}" AND c.Topic = "user_timesheet_certified" `,
  );

  function removeUserToNotificationGroup() {
    return deleteGroupUser.mutateAsync(isCertitiedRequest.data);
  }

  async function addUserToNotificationGroup() {
    const groupUser = new NotificationGroupUser();
    groupUser.UserId = user.id;
    groupUser.Topic = "user_timesheet_certified";
    groupUser.Type = NotificationType.App;
    await upsertGroupUser.mutateAsync(groupUser);
    isCertitiedRequest.refetch();
  }

  return (
    <>
      <div className="flex items-center justify-start">
        <PolHeading size={1} className="m-5">
          Timesheet Review
        </PolHeading>
      </div>
      <PolRequestPresenter
        request={[
          userTimesheetRequest,
          roleRequest,
          clientRequest,
          projectRequest,
          workingPhaseRequest,
          taskRequest,
          subTasksRequest,
          usersRequest,
        ]}
        onSuccess={() => (
          <>
            <div className="m-5 flex gap-2">
              <PolDropdown
                className="w-[250px]"
                value={weekSelected}
                options={weekOfs}
                onValueChanged={(value) => setWeekSelected(value)}
                nameGetter={(x) => getWeekLabel(x)}
              />
              <PolRequestPresenter
                showWhenNullResults={true}
                request={isCertitiedRequest}
                onSuccess={() => (
                  <PolSwitch
                    value={isUsable(isCertitiedRequest.data)}
                    onValueChanged={(e) => (e ? addUserToNotificationGroup() : removeUserToNotificationGroup())}
                  >
                    Receive Notifications
                  </PolSwitch>
                )}
              />
              <PolButton>Import</PolButton>
            </div>
            <Content
              roles={roleRequest.data}
              clients={clientRequest.data}
              projects={projectRequest.data}
              workingPhases={workingPhaseRequest.data}
              tasks={taskRequest.data}
              subTasks={subTasksRequest.data}
              users={usersRequest.data}
              userTimesheets={userTimesheetRequest.data}
            />
          </>
        )}
      ></PolRequestPresenter>
    </>
  );
}

const Content = ({
  userTimesheets,
  users,
  roles,
  clients,
  projects,
  workingPhases,
  tasks,
  subTasks,
}: {
  userTimesheets: UserTimesheet[];
  users: User[];
  roles: Role[];
  clients: Client[];
  projects: Project[];
  workingPhases: WorkingPhase[];
  tasks: Task[];
  subTasks: SubTask[];
}) => {
  const [selectedTimeActivities, setSelectedTimeActivities] = useState<TimeActivity[]>([]);
  const timeActivitiesRequest = useDbQuery(
    TimeActivity,
    `WHERE c.UserTimesheetId IN [${userTimesheets.map((x) => x.id)}]`,
  );
  const [groupBy, setGroupBy] = useState(["UserId"]);
  const gridStyle = { minHeight: 900 };
  const renderGroupTitle = useCallback((value, { data }) => {
    let summary = null;

    if (data.groupColumnSummary) {
      summary = <b> Hours: {data.groupColumnSummary.Hours}</b>;
    }

    return (
      <div>
        {value}
        {summary}
      </div>
    );
  }, []);

  const onSelectionChange = (selected) => {
    const items = [];
    let objectCount = 0;
    for (let key in selected.selected) {
      if (typeof selected.selected[key] === "object") {
        objectCount++;
      }
    }

    for (let key in selected.selected) {
      let nextItem = selected.selected[key];

      if (nextItem === true) {
        nextItem = selected.originalData.find((x) => x.id === key);
      } else if (selectedTimeActivities.find((x) => x.id === nextItem.id && objectCount === 1)) {
        setSelectedTimeActivities([]);
        return;
      }

      items.push(nextItem);
    }

    setSelectedTimeActivities((prev) => {
      return [...items];
    });
  };
  let selected = selectedTimeActivities.reduce((map, activity) => {
    map[activity.id] = true;
    return map;
  }, {});
  function getCollapsedGroups() {
    const uniqueUserIds = new Set<string>();

    timeActivitiesRequest.data.forEach((activity) => {
      uniqueUserIds.add(activity.UserId);
    });

    const userIdMap: { [userId: string]: boolean } = {};
    uniqueUserIds.forEach((userId) => {
      userIdMap[userId] = true;
    });
    return userIdMap;
  }

  return (
    <>
      <PolRequestPresenter
        request={timeActivitiesRequest}
        onSuccess={() => {
          const timeActivitiesSorted = timeActivitiesRequest.data.sort((a, b) => {
            const userAFirstName = users.find((x) => x.id === a.UserId)?.Person?.LegalName?.First || "";
            const userBFirstName = users.find((x) => x.id === b.UserId)?.Person?.LegalName?.First || "";

            return userAFirstName.localeCompare(userBFirstName);
          });

          return (
            <ReactDataGrid
              theme="pol-blue"
              resizable={true}
              defaultCollapsedGroups={getCollapsedGroups()}
              idProperty="id"
              selected={selected}
              onSelectionChange={onSelectionChange}
              enableSelection={true}
              multiSelect={true}
              onGroupByChange={setGroupBy}
              groupBy={groupBy}
              style={gridStyle}
              emptyText={"No time entries available."}
              columns={[
                {
                  renderGroupTitle: (data, info) => {
                    //901
                    const user = users.find((x) => x.id === data);
                    const isCertified = userTimesheets.find(
                      (x) => x.UserId === user?.id && x.CertifiedDateTime !== null,
                    );

                    return (
                      <div className="flex items-center justify-between">
                        <p
                          className={isCertified ? "text-black" : "text-gray-400"}
                        >{`${getFullName(users.find((x) => x.id === data)?.Person)}`}</p>
                        <p
                          className={
                            info.data.groupColumnSummary.Hours > 40 && "rounded-md bg-red-100 p-1 text-red-500"
                          }
                        >{`Hours: ${info.data.groupColumnSummary.Hours}`}</p>
                      </div>
                    );
                  },
                  name: "UserId",
                  header: "Employee",
                  render: ({ data }) => <p>{getFullName(users.find((x) => x.id === data.UserId)?.Person)}</p>,
                },
                {
                  name: "ActivityDate",
                  header: "Date",
                  render: ({ data }) => <p>{data.ActivityDate?.format("MM/DD/YYYY")}</p>,
                  defaultWidth: 100,
                },
                {
                  renderGroupTitle: (data, info) => {
                    return (
                      <div className="flex justify-between">
                        <p>{`${clients.find((x) => x.id === data)?.CompanyName}`}</p>
                        <p>{`Hours: ${info.data.groupColumnSummary.Hours}`}</p>
                      </div>
                    );
                  },
                  name: "ClientId",
                  header: "Client",
                  render: ({ data }) => {
                    return <p>{clients.find((x) => x.id === String(data.ClientId))?.CompanyName}</p>;
                  },
                  defaultWidth: 135,
                },
                {
                  renderGroupTitle: (data, info) => {
                    return (
                      <div className="flex justify-between">
                        <p>{`${projects.find((x) => x.id === data)?.Nickname}`}</p>
                        <p>{`Hours: ${info.data.groupColumnSummary.Hours}`}</p>
                      </div>
                    );
                  },
                  name: "ProjectId",
                  header: "Project",
                  defaultWidth: 100,

                  render: ({ data }) => <p>{projects.find((x) => x.id === data.ProjectId)?.Nickname}</p>,
                },
                {
                  renderGroupTitle: (data, info) => {
                    return (
                      <div className="flex justify-between">
                        <p>{`${workingPhases.find((x) => x.id === data)?.DisplayName}`}</p>
                        <p>{`Hours: ${info.data.groupColumnSummary.Hours}`}</p>
                      </div>
                    );
                  },
                  name: "WorkingPhaseId",
                  header: "Working Phase",
                  defaultWidth: 200,

                  render: ({ data }) => <p>{workingPhases.find((x) => x.id === data.WorkingPhaseId)?.DisplayName}</p>,
                },
                {
                  renderGroupTitle: (data, info) => {
                    return (
                      <div className="flex justify-between">
                        <p>{`${roles.find((x) => x.id === data)?.Title}`}</p>
                        <p>{`Hours: ${info.data.groupColumnSummary.Hours}`}</p>
                      </div>
                    );
                  },
                  name: "RoleId",
                  header: "Role",

                  render: ({ data }) => <p>{roles.find((x) => x.id === data.RoleId)?.Title}</p>,
                },
                {
                  renderGroupTitle: (data, info) => {
                    return (
                      <div className="flex justify-between">
                        <p>{`${tasks.find((x) => x.id === data)?.Title}`}</p>
                        <p>{`Hours: ${info.data.groupColumnSummary.Hours}`}</p>
                      </div>
                    );
                  },
                  name: "TaskId",
                  header: "Task",
                  defaultWidth: 125,

                  render: ({ data }) => <p>{tasks.find((x) => x.id === data.TaskId)?.Title}</p>,
                },
                {
                  renderGroupTitle: (data, info) => {
                    return (
                      <div className="flex justify-between">
                        <p>{`${subTasks.find((x) => x.id === data)?.Title}`}</p>
                        <p>{`Hours: ${info.data.groupColumnSummary.Hours}`}</p>
                      </div>
                    );
                  },
                  name: "SubTaskId",
                  header: "Sub Task",

                  render: ({ data }) => <p>{subTasks.find((x) => x.id === data.SubTaskId)?.Title}</p>,
                },

                {
                  name: "Description",
                  flex: 1,
                  header: "Description",
                  render: ({ data }) => <p>{data.Description}</p>,
                },

                {
                  name: "Verification",

                  render: ({ data }) => {
                    return (
                      <span>
                        <PolIcon name="FileWarning" stroke={data.HasRequestVerification ? "red" : "gray"}></PolIcon>
                      </span>
                    );
                  },
                  defaultWidth: 50,
                },
                {
                  defaultWidth: 50,
                  name: "Billing Change",

                  render: ({ data }) => {
                    return (
                      <span>
                        <PolIcon name="FileWarning" stroke={data.HasRequestBillableChange ? "red" : "gray"}></PolIcon>
                      </span>
                    );
                  },
                },
                {
                  groupBy: false,
                  type: "number",
                  name: "Hours",

                  header: "Hours",
                  render: ({ data }) => <p>{data.Hours}</p>,
                  groupSummaryReducer: {
                    initialValue: 0,
                    reducer: (total, current) => {
                      return total + current;
                    },
                  },
                  defaultWidth: 86,
                },
              ]}
              renderGroupTitle={renderGroupTitle}
              dataSource={timeActivitiesSorted}
            ></ReactDataGrid>
          );
        }}
      ></PolRequestPresenter>
      {selectedTimeActivities.length > 0 && (
        <TimeActivitySideEditor
          isModal={false}
          onChange={setSelectedTimeActivities}
          timeActivities={selectedTimeActivities}
        ></TimeActivitySideEditor>
      )}
    </>
  );
};

export function WeeklyHoursInput({
  values,
  setValues,
}: {
  values?: number[];
  setValues?: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  return (
    <div className="grid grid-flow-col gap-3">
      <PolInput
        value={values[0]}
        onValueChanged={(x) => setValues((prev) => [x, ...prev.slice(1)])}
        type="number"
        label="S"
        className="text-center"
        containerClassName="flex flex-col items-center justify-center"
      ></PolInput>
      <PolInput
        onValueChanged={(x) => setValues((prev) => [prev[0], x, ...prev.slice(2)])}
        value={values[1]}
        type="number"
        label="M"
        className="text-center"
        containerClassName="flex flex-col items-center justify-center"
      ></PolInput>
      <PolInput
        onValueChanged={(x) => setValues((prev) => [...prev.slice(0, 2), x, ...prev.slice(3)])}
        value={values[2]}
        type="number"
        label="T"
        containerClassName="flex flex-col items-center justify-center"
      ></PolInput>
      <PolInput
        onValueChanged={(x) => setValues((prev) => [...prev.slice(0, 3), x, ...prev.slice(4)])}
        value={values[3]}
        type="number"
        label="W"
        className="text-center"
        containerClassName="flex flex-col items-center justify-center"
      ></PolInput>
      <PolInput
        onValueChanged={(x) => setValues((prev) => [...prev.slice(0, 4), x, ...prev.slice(5)])}
        value={values[4]}
        type="number"
        label="T"
        className="text-center"
        containerClassName="flex flex-col items-center justify-center"
      ></PolInput>
      <PolInput
        onValueChanged={(x) => setValues((prev) => [...prev.slice(0, 5), x])}
        value={values[5]}
        type="number"
        label="F"
        className="text-center"
        containerClassName="flex flex-col items-center justify-center"
      ></PolInput>
      <PolInput
        onValueChanged={(x) => setValues((prev) => [...prev.slice(0, 6), x])}
        value={values[6]}
        type="number"
        label="S"
        className="text-center"
        containerClassName="flex flex-col items-center justify-center"
      ></PolInput>
    </div>
  );
}
