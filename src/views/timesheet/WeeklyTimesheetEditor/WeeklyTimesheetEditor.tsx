import AuthSection from "@/components/AuthSection";
import PolIcon from "@/components/PolIcon";
import SavingIndicator from "@/components/indicator/SavingIndicator";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolDropdown } from "@/components/polComponents/PolDropdown";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolTable from "@/components/polComponents/PolTable";
import PolTableCell from "@/components/polComponents/PolTableCell";
import PolTableHeader from "@/components/polComponents/PolTableHeader";
import PolText from "@/components/polComponents/PolText";
import { Seo } from "@/components/polComponents/Seo";
import { useAlert } from "@/contexts/AlertContext";
import { TimeActivityDropdownContext } from "@/contexts/TimeActivityDropdownContext";
import { useAuth } from "@/customHooks/auth";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import useAutosaveState from "@/customHooks/sdkHooks/useEntityAutosave";
import useOnScreen from "@/customHooks/useOnScreen";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { TenantUserAccess } from "@/sdk/entities/auth/TenantUserAccess";
import { User } from "@/sdk/entities/core/User";
import { Client } from "@/sdk/entities/project/Client";
import { Project } from "@/sdk/entities/project/Project";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import { TimeBlock } from "@/sdk/models/TimeBlock";
import { onSdkRequestErrors } from "@/sdk/services/Http/HttpRequestHandler";
import { TimeBlockTableRow } from "@/views/timesheet/WeeklyTimesheetEditor/TimeBlockTableRow";
import { Role } from "@sdk/./entities/billing/Role";
import { SubTask } from "@sdk/./entities/billing/SubTask";
import { Task } from "@sdk/./entities/billing/Task";
import { TimeActivity } from "@sdk/./entities/billing/TimeActivity";
import { UserTimesheet } from "@sdk/./entities/billing/UserTimesheet";
import { groupByMultipleCriteria, tryGetSum } from "@sdk/./utils/arrayUtils";
import { addDays } from "@sdk/./utils/dateUtils";
import { getFullName } from "@sdk/./utils/entityUtils/userUtils";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import { AnimatePresence, motion } from "framer-motion";
import moment, { Moment } from "moment/moment";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ReadonlyTimeBlockTableRow } from "./ReadonlyTimeBlockTableRow";

function getAllSundaysOfLastMonths(daysBack: number, daysForward: number): Moment[] {
  const startingMoment = moment().startOf("day");
  let endDate = startingMoment.clone().add(daysForward, "days");
  let startDate = startingMoment.clone().add(-1 * daysBack, "days");

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
  const now = moment();
  const thisWeek = now.week();
  const inputWeek = (currentMoment ?? moment()).week();

  if (inputWeek === thisWeek) {
    return "thisWeek";
  } else if (inputWeek === thisWeek - 1) {
    return "lastWeek";
  } else {
    return formatDateWithoutDash(currentMoment);
  }
}

function getWeekLabel(date: Moment): string {
  const isThisWeek = date.week() === moment().week();
  if (isThisWeek) {
    return "This Week";
  }
  const isLastWeek = date.week() === moment().add(-7, "days").week();
  if (isLastWeek) {
    return "Last Week";
  }
  const nextWeek = addDays(date.clone(), 6);
  return `${date.month() + 1}/${date.date()}/${date.year()} - ${
    nextWeek.month() + 1
  }/${nextWeek.date()}/${nextWeek.year()}`;
}

function parseDate(dateString: string): Moment {
  const year = dateString.substring(4, 8);
  const month = dateString.substring(0, 2);
  const day = dateString.substring(2, 4);

  return moment(`${year}-${month}-${day}`);
}

const ignoreDeleteOptions = { onSuccess: undefined };

interface DayColumnProps {
  weekSelected: Moment;
  timeActivities: TimeActivity[];
  dayIndex: number;
}

function DayColumn({ weekSelected, timeActivities, dayIndex }: DayColumnProps) {
  let day = "Sun";
  switch (dayIndex) {
    case 1:
      day = "Mon";
      break;
    case 2:
      day = "Tue";
      break;
    case 3:
      day = "Wed";
      break;
    case 4:
      day = "Thu";
      break;
    case 5:
      day = "Fri";
      break;
    case 6:
      day = "Sat";
      break;
  }
  return (
    <div className="grid grid-flow-row">
      <div className="mx-auto">
        <span>{day}</span>
        <span className="text-xs"> - {weekSelected?.clone().add(dayIndex, "days").format("DD")}</span>
      </div>
      <span className="w-18 mx-auto rounded-md bg-secondary-50 p-1 px-2 text-xs">
        {tryGetSum(timeActivities.filter((x) => x.ActivityDate?.day() == dayIndex).map((x) => x.Hours))} hrs
      </span>
    </div>
  );
}

export default function WeeklyTimesheetEditor() {
  const { user, hasAccess, activeTenant } = useAuth();

  const clientRequest = useDbQuery(Client);
  const projectRequest = useDbQuery(Project);
  const workingPhaseRequest = useDbQuery(WorkingPhase);
  const roleRequest = useDbQuery(Role);
  const taskRequest = useDbQuery(Task);
  const subtaskRequest = useDbQuery(SubTask);

  const navigate = usePolNavigate();

  const [weekStartOf, setWeekStartOf] = useSearchParamState("selectedWeekId", "thisWeek");
  const [selectedUserId, setSelectedUserId] = useSearchParamState("userId", user?.id ?? "");
  const [weekSelected, setWeekSelected] = useState(() => getLastSunday(getWeekFromId(weekStartOf)));
  const [userSelected, setUserSelected] = useState<User>(undefined);
  const tenantUserAccessRequest = useDbQuery(TenantUserAccess, `WHERE c.TenantId = "${activeTenant?.id}"`, {
    enabled: isUsable(activeTenant),
  });
  const userRequest = useDbQuery(
    User,
    `WHERE c.id IN ["${tenantUserAccessRequest.data?.map((x) => x.UserId).join('","')}"]`,
    { enabled: isUsable(tenantUserAccessRequest.data) },
  );

  const alert = useAlert();

  const mutateTimesheet = useDbUpsert(UserTimesheet);

  async function certifyTimesheet() {
    if (isUsable(userTimesheetRequest.data) === false) return;
    const confirmed = await alert.showAlert({
      title: "Confirmation",
      description:
        "Certifying your timesheet is an action that cannot be undone. You're verifying that your timesheet is accurate and cannot be edited after certification. Are you sure you want to continue?",
    });
    if (confirmed === false) return;
    const certified = { ...userTimesheetRequest.data, CertifiedDateTime: moment.utc() };

    await mutateTimesheet.mutateAsync(certified);
  }

  async function uncertifyTimesheet() {
    if (isUsable(userTimesheetRequest.data) === false) return;
    const certified = { ...userTimesheetRequest.data, CertifiedDateTime: null };

    await mutateTimesheet.mutateAsync(certified);
  }

  useEffect(() => {
    setWeekStartOf(getIdFromDate(weekSelected));
  }, [weekSelected]);

  function AddTimeBlock() {
    const time = new TimeBlock();
    setTimeblocks((x) => [...x, time]);
  }

  function navigateToEditor() {
    navigate({ to: "/timesheet/dropdowns" });
  }

  useEffect(() => {
    const user = userRequest.data?.find((x) => x.id === selectedUserId);
    if (selectedUserId === "") {
      setUserSelected(user);
      return;
    }
    if (isUsable(user)) {
      setUserSelected(user);
    }
  }, [selectedUserId, user, setSelectedUserId, userRequest.data]);

  useEffect(() => {
    if (isUsable(user) && isUsable(selectedUserId) === false) setSelectedUserId(user.id);
  }, [user]);

  const userTimesheetRequest = useDbQueryFirst(
    UserTimesheet,
    `GET GetOrAdd?userId=${userSelected?.id}&weekOf=${formatDateWithDash(weekSelected)}`,
    {
      enabled: isUsable(weekSelected) && isUsable(userSelected),
    },
  );
  const timeActivityRequest = useDbQuery(
    TimeActivity,
    `WHERE c.UserTimesheetId = "${userTimesheetRequest.data?.id}" `,
    { enabled: isUsable(userTimesheetRequest.data), staleTime: 0, refetchOnWindowFocus: false },
  );

  let errorMessage = "";
  onSdkRequestErrors(async (x) => {
    errorMessage = x.message;
    return false;
  });

  const [timeActivities, update, saveMutation, setWithoutUpdate] = useAutosaveState<TimeActivity[]>(TimeActivity, [], {
    delay: 0,
  });
  const [timeblocks, setTimeblocks] = useState<TimeBlock[]>([
    new TimeBlock(),
    new TimeBlock(),
    new TimeBlock(),
    new TimeBlock(),
  ]);

  useEffect(() => {
    if (userTimesheetRequest.isFetching) {
      setWithoutUpdate([]);
      setTimeblocks([new TimeBlock(), new TimeBlock(), new TimeBlock(), new TimeBlock()]);
    }
    if (timeActivityRequest.isFetching) {
      setTimeblocks([new TimeBlock(), new TimeBlock(), new TimeBlock(), new TimeBlock()]);
    }
  }, [userTimesheetRequest, timeActivityRequest]);

  useEffect(() => {
    if (isUsable(timeActivityRequest.data)) {
      setTimeblocks([new TimeBlock(), new TimeBlock(), new TimeBlock(), new TimeBlock()]);
      setWithoutUpdate(timeActivityRequest.data);
    }
  }, [userTimesheetRequest.data, timeActivityRequest.data]);

  useLayoutEffect(() => {
    const timesheet = userTimesheetRequest.data;
    if (isUsable(timesheet) === false) return;

    const timeItems = [...timeActivities];
    const groupedItems = groupByMultipleCriteria(timeItems, [
      "ClientId",
      "ProjectId",
      "WorkingPhaseId",
      "RoleId",
      "TaskId",
      "SubTaskId",
      "Description",
      "AdminNotes",
      "UserNotes",
      "HasRequestBillableChange",
      "HasRequestVerification",
    ]);

    let newTimeblocks =
      groupedItems && groupedItems.length > 0
        ? groupedItems.map((x) => {
            const timeBlock =
              timeblocks.find((i) => {
                const a = i.Ref;
                const b: TimeActivity = x.items[0];

                return (
                  a.ClientId === b.ClientId &&
                  a.ProjectId === b.ProjectId &&
                  a.WorkingPhaseId === b.WorkingPhaseId &&
                  a.RoleId === b.RoleId &&
                  a.TaskId === b.TaskId &&
                  a.SubTaskId === b.SubTaskId &&
                  a.Description === b.Description &&
                  a.AdminNotes === b.AdminNotes &&
                  a.UserNotes === b.UserNotes &&
                  a.HasRequestBillableChange === b.HasRequestBillableChange &&
                  a.HasRequestVerification === b.HasRequestVerification
                );
              }) ?? new TimeBlock();
            timeBlock.Sunday = x.items.find((x) => x.ActivityDate?.weekday() === 0);
            timeBlock.Monday = x.items.find((x) => x.ActivityDate?.weekday() === 1);
            timeBlock.Tuesday = x.items.find((x) => x.ActivityDate?.weekday() === 2);
            timeBlock.Wednesday = x.items.find((x) => x.ActivityDate?.weekday() === 3);
            timeBlock.Thursday = x.items.find((x) => x.ActivityDate?.weekday() === 4);
            timeBlock.Friday = x.items.find((x) => x.ActivityDate?.weekday() === 5);
            timeBlock.Saturday = x.items.find((x) => x.ActivityDate?.weekday() === 6);
            timeBlock.Ref = x.items.find((x) => isUsable(x));
            return { ...timeBlock };
          })
        : [];

    const newTimeBlockIds = newTimeblocks.map((x) => x.Ref.id);
    newTimeblocks = [
      ...timeblocks
        .filter((x) => newTimeBlockIds.includes(x.Ref.id) === false)
        .filter((x) => isUsable(x.Ref.TaskId) && x.Ref.TaskId != ""),
      ...newTimeblocks,
    ]
      .filter((x) => x.Ref.UserTimesheetId === userTimesheetRequest.data.id)
      .sort((a, b) => (a.Ref.CreatedDateTime?.isBefore(b.Ref.CreatedDateTime) ? -1 : 1));
    if (isUsable(timesheet.CertifiedDateTime) === false) {
      newTimeblocks.push(new TimeBlock());
      newTimeblocks.push(new TimeBlock());

      newTimeblocks.push(new TimeBlock());
    }

    console.log("New TIme blocks", newTimeblocks);

    setTimeblocks(newTimeblocks);
  }, [timeActivities, userTimesheetRequest.data]);

  const onTimeActivitiesUpdated = useCallback((newValues: TimeActivity[]) => {
    update((oldValues: TimeActivity[]) =>
      oldValues.map((x) => {
        const newValue = newValues.find((nv) => nv.id == x.id);
        if (isUsable(newValue)) {
          return newValue;
        } else {
          return x;
        }
      }),
    );
  }, []);

  const deleteMutation = useDbDelete(TimeActivity, ignoreDeleteOptions);

  const onTimeActivitiesRemoved = useCallback(async (removedValues: TimeActivity[], deleteButtonPressed: boolean) => {
    const removedIds = removedValues.map((x) => x.id);
    await deleteMutation.mutateAsync(removedValues, {
      onSuccess: async () => {
        if (deleteButtonPressed) {
          await timeActivityRequest.refetch();
          return;
        }
        setWithoutUpdate((x) => x.filter((i) => removedIds.includes(i.id) === false));
      },
    });
  }, []);

  const onTimeActivitiesAdded = useCallback(
    (newValues: TimeActivity[]) => {
      update((x) => {
        let newItems: TimeActivity[] = [
          ...x,
          ...newValues
            .filter((x) => isUsable(x))
            .map((x) => ({ ...x, UserTimesheetId: userTimesheetRequest.data.id, UserId: selectedUserId })),
        ];

        const newValueIds = newValues.map((x) => x.id);

        const groupedItems = groupByMultipleCriteria(newItems, [
          "ClientId",
          "ProjectId",
          "WorkingPhaseId",
          "RoleId",
          "TaskId",
          "SubTaskId",
          "Description",
          "AdminNotes",
          "UserNotes",
          "HasRequestBillableChange",
          "HasRequestVerification",
        ]);

        groupedItems.forEach((group) => {
          const normalizedItems = group.items.map((item) => ({
            ...item,
            ActivityDate: item.ActivityDate.clone().startOf("day"),
          }));

          // Count occurrences of each date
          const dateCounts = normalizedItems.reduce(
            (acc, { ActivityDate }) => {
              const dateKey = ActivityDate.format("YYYY-MM-DD");
              acc[dateKey] = (acc[dateKey] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          );

          // Filter items that have a date occurring more than once
          const duplicates = normalizedItems.filter((item) => {
            const dateKey = item.ActivityDate.format("YYYY-MM-DD");
            return dateCounts[dateKey] > 1;
          });

          const groupedByDate = duplicates.reduce(
            (acc, item) => {
              const dateKey = item.ActivityDate.format("MM-DD-YYYY");
              if (!acc[dateKey]) {
                acc[dateKey] = [];
              }
              acc[dateKey].push(item);
              return acc;
            },
            {} as Record<string, TimeActivity[]>,
          );

          for (const dateKey in groupedByDate) {
            if (groupedByDate.hasOwnProperty(dateKey)) {
              const itemsForDate = groupedByDate[dateKey];
              const itemsForDateIds = itemsForDate.map((x) => x.id);

              const sumOfNewItems = tryGetSum(
                itemsForDate.filter((x) => newValueIds.includes(x.id)).map((x) => x.Hours),
              );

              const timeActivity = itemsForDate.find((x) => newValueIds.includes(x.id) == false);
              timeActivity.Hours += sumOfNewItems;

              newItems = [...newItems.filter((x) => itemsForDateIds.includes(x.id) === false), timeActivity];
            }
          }
        });
        return newItems;
      });
    },
    [userTimesheetRequest.data, selectedUserId, timeActivities],
  );

  const totalRef = useRef(null);
  const isTotalVisible = useOnScreen(totalRef, "-70px");

  return (
    <>
      <Seo title="Timesheet" />
      <div className="grid w-full dark:bg-gray-800" style={{ gridTemplateRows: "auto 1fr" }}>
        <div className=" grid grid-flow-col p-5" style={{ gridTemplateColumns: "auto 1fr auto" }}>
          <div className="grid  grid-flow-col grid-cols-[auto_1fr_1fr_auto] space-x-2 align-middle">
            {isUsable(userTimesheetRequest.data?.CertifiedDateTime) == false ? (
              <PolButton
                data-testid="certifyTimesheet"
                variant="ghost"
                tooltip="Certify Timesheet"
                onClick={certifyTimesheet}
              >
                <PolIcon name="LockOpen" source="material" />
              </PolButton>
            ) : (
              <AuthSection
                accessRequired={AccessKeys.TimesheetAdmin}
                fallback={<PolIcon name="Lock" source="material" className="m-auto mx-2" />}
              >
                <PolButton
                  data-testid="uncertifyTimesheet"
                  variant="ghost"
                  tooltip="Uncertify Timesheet"
                  onClick={uncertifyTimesheet}
                >
                  <PolIcon name="Lock" source="material" />
                </PolButton>
              </AuthSection>
            )}
            <AuthSection accessRequired={AccessKeys.TimesheetAdmin}>
              <PolEntityDropdown
                data-testid="userDropdown"
                className="min-w-[225px]"
                selectedId={selectedUserId}
                options={userRequest.data}
                onValueChanged={(value) => setSelectedUserId(value.id)}
                nameGetter={(x) => getFullName(x.Person)}
              />
            </AuthSection>
            <PolDropdown
              data-testid="weekSelectedDropdown"
              className="min-w-[225px]"
              value={weekSelected}
              options={weekOfs}
              onValueChanged={(value) => setWeekSelected(value)}
              nameGetter={(x) => getWeekLabel(x)}
            />

            {isUsable(userTimesheetRequest.data?.CertifiedDateTime) == false && (
              <PolButton
                variant="ghost"
                tooltip="Add time item"
                disabled={isUsable(userTimesheetRequest.data) === false}
                onClick={AddTimeBlock}
              >
                <PolIcon name="Plus" source="lucide" />
              </PolButton>
            )}

            <AuthSection accessRequired={AccessKeys.TimesheetAdmin}>
              <PolButton
                variant="ghost"
                tooltip="Edit Dropdowns"
                disabled={isUsable(userTimesheetRequest.data) === false}
                onClick={navigateToEditor}
              >
                <PolIcon name="Cog" source="lucide" />
              </PolButton>
            </AuthSection>

            <AuthSection accessRequired={AccessKeys.TimesheetAdmin}>
              <PolButton
                variant="ghost"
                tooltip="Review"
                disabled={isUsable(userTimesheetRequest.data) === false}
                onClick={() => navigate({ to: "/timesheet/review" })}
              >
                <PolIcon name="ListChecks" source="lucide" />
              </PolButton>
            </AuthSection>
          </div>

          <div>
            <span>{errorMessage}</span>
          </div>
          <div ref={totalRef} className="grid grid-flow-col text-3xl font-semibold">
            <SavingIndicator className="mx-2 my-auto" isSaving={saveMutation.isPending || deleteMutation.isPending} />
            <PolText type="lead" className="my-auto font-bold">
              {"Total: " + tryGetSum(timeActivities.map((x) => x.Hours)) + " hrs"}
            </PolText>
          </div>
        </div>
        <PolRequestPresenter
          showWhenPending={false}
          request={[
            userTimesheetRequest,
            timeActivityRequest,
            clientRequest,
            projectRequest,
            workingPhaseRequest,
            roleRequest,
            taskRequest,
            subtaskRequest,
          ]}
          onSuccess={() => (
            <TimeActivityDropdownContext.Provider
              value={{
                Clients: clientRequest.data,
                Projects: projectRequest.data,
                WorkingPhases: workingPhaseRequest.data,
                Roles: roleRequest.data,
                Tasks: taskRequest.data,
                SubTasks: subtaskRequest.data,
              }}
            >
              <PolTable
                columns={[
                  { className: "w-[25px]" },
                  { className: "w-auto min-w-[210px]" },
                  { className: "w-[90px]" },
                  { className: "w-[90px]" },
                  { className: "w-[90px]" },
                  { className: "w-[90px]" },
                  { className: "w-[90px]" },
                  { className: "w-[90px]" },
                  { className: "w-[90px]" },
                  { className: "w-[50px]" },
                  { className: "w-[80px]" },
                ]}
                className="mt-0 h-fit table-fixed	"
                items={timeblocks}
                header={() => (
                  <>
                    <PolTableHeader className="sticky top-[48px] z-10 table-row border-b bg-background-50 ">
                      <PolTableCell>#</PolTableCell>
                      <PolTableCell>Detail</PolTableCell>
                      <PolTableCell>
                        <DayColumn weekSelected={weekSelected} timeActivities={timeActivities} dayIndex={0}></DayColumn>
                      </PolTableCell>
                      <PolTableCell>
                        <DayColumn weekSelected={weekSelected} timeActivities={timeActivities} dayIndex={1}></DayColumn>
                      </PolTableCell>
                      <PolTableCell>
                        <DayColumn weekSelected={weekSelected} timeActivities={timeActivities} dayIndex={2}></DayColumn>
                      </PolTableCell>
                      <PolTableCell>
                        <DayColumn weekSelected={weekSelected} timeActivities={timeActivities} dayIndex={3}></DayColumn>
                      </PolTableCell>
                      <PolTableCell>
                        <DayColumn weekSelected={weekSelected} timeActivities={timeActivities} dayIndex={4}></DayColumn>
                      </PolTableCell>
                      <PolTableCell>
                        <DayColumn weekSelected={weekSelected} timeActivities={timeActivities} dayIndex={5}></DayColumn>
                      </PolTableCell>
                      <PolTableCell>
                        <DayColumn weekSelected={weekSelected} timeActivities={timeActivities} dayIndex={6}></DayColumn>
                      </PolTableCell>
                      <PolTableCell>Total</PolTableCell>
                      <PolTableCell>
                        <AnimatePresence>
                          {isTotalVisible === false &&
                            (saveMutation.isPending || deleteMutation.isPending) == false && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                transition={{ duration: 0.2 }}
                                className="my-auto"
                              >
                                <PolText type="lead" className="my-auto text-xs font-bold">
                                  {tryGetSum(timeActivities.map((x) => x.Hours)) + " hrs"}
                                </PolText>
                              </motion.span>
                            )}
                          {isTotalVisible === false && (
                            <SavingIndicator
                              className="mx-2 my-auto"
                              isSaving={saveMutation.isPending || deleteMutation.isPending}
                              collapse
                            />
                          )}
                        </AnimatePresence>
                      </PolTableCell>
                    </PolTableHeader>
                  </>
                )}
                itemTemplate={(x, index) =>
                  userTimesheetRequest.data.CertifiedDateTime === null ? (
                    <TimeBlockTableRow
                      currentUserId={selectedUserId}
                      weekOf={weekSelected}
                      index={index}
                      item={x}
                      onTimeActivitiesAdded={onTimeActivitiesAdded}
                      onTimeActivitiesRemoved={onTimeActivitiesRemoved}
                      onTimeActivitiesUpdated={onTimeActivitiesUpdated}
                    />
                  ) : (
                    <ReadonlyTimeBlockTableRow
                      currentUserId={selectedUserId}
                      weekOf={weekSelected}
                      index={index}
                      item={x}
                    />
                  )
                }
                emptyTemplate={() => (
                  <tr>
                    <td colSpan={11} className="h-72 ">
                      <div className="grid">
                        {userTimesheetRequest.data.CertifiedDateTime ? (
                          <PolText className="m-auto">No hours were tracked this week.</PolText>
                        ) : (
                          <PolText className="m-auto">
                            Add your first{" "}
                            <a className="cursor-pointer text-blue-500" onClick={AddTimeBlock}>
                              line
                            </a>
                            !
                          </PolText>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              />
            </TimeActivityDropdownContext.Provider>
          )}
        />
      </div>
    </>
  );
}
