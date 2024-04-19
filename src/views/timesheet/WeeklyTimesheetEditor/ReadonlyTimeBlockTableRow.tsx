import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import PolTableCell from "@/components/polComponents/PolTableCell";
import PolTableRow from "@/components/polComponents/PolTableRow";
import { TimeActivityDropdownContext } from "@/contexts/TimeActivityDropdownContext";
import { useAuth } from "@/customHooks/auth";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import { TimeBlock } from "@/sdk/models/TimeBlock";
import { TimeActivity } from "@sdk/./entities/billing/TimeActivity";
import { tryGetSum } from "@sdk/./utils/arrayUtils";
import { isNullOrWhitespace } from "@sdk/./utils/stringUtils";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import { Moment } from "moment/moment";
import { useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useState } from "react";
import PolText from "@/components/polComponents/PolText";
import { LabelSection } from "@/components/LabelSection/LabelSection";
import { isBillable, isOnInvoice } from "@/sdk/utils/billingStatusUtils";

interface Props {
  item: TimeBlock;
  index: number;
  weekOf: Moment;
  currentUserId: string;
}
export const ReadonlyTimeBlockTableRow = ({ index, item, weekOf, currentUserId }: Props) => {
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

  const dropdowns = useContext(TimeActivityDropdownContext);

  const GetTitle = useCallback((x) => {
    return x.Title;
  }, []);

  const getDisplayName = useCallback((x) => {
    return x.DisplayName;
  }, []);

  const getNickname = useCallback((x) => {
    return dropdowns.Clients.find((i) => i.id == x.ClientId)?.DisplayName + ": " + x.Nickname;
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
      <PolTableRow key={id}>
        <PolTableCell>
          <div className="grid h-full grid-flow-row grid-rows-3">
            <div></div>
            <PolText className="text-center">{index + 1}</PolText>
            {isBillable(refItem.BillingDetails.Status) && (
              <PolIcon
                name="CircleDollarSign"
                size="1.3rem"
                className="mx-auto"
                stroke={
                  hasAdminRights
                    ? isOnInvoice(refItem.BillingDetails.Status) && hasAdminRights
                      ? "rgb(250 204 21)"
                      : "rgb(22 101 52)"
                    : "gray"
                }
              />
            )}
          </div>
        </PolTableCell>
        <PolTableCell>
          <div className="grid grid-flow-col grid-cols-[auto_1fr]">
            <PolButton variant="ghost" tooltip="Copy dropdowns" className="mx-2 " onClick={copyDropdowns}>
              <PolIcon name="Copy" />
            </PolButton>
            <div className="flex flex-row flex-wrap  rounded-md border bg-background-50 px-5 py-2">
              <LabelSection label={"Client"} className="mr-5">
                <PolText>{dropdowns.Clients.find((x) => x.id === clientId)?.DisplayName}</PolText>
              </LabelSection>
              <LabelSection label={"Project"} className="mr-5">
                <PolText>{dropdowns.Projects.find((x) => x.id === projectId)?.Nickname}</PolText>
              </LabelSection>

              <LabelSection label={"Working Phase"} className="mr-5">
                <PolText>{dropdowns.WorkingPhases.find((x) => x.id === workingPhaseId)?.DisplayName}</PolText>
              </LabelSection>

              <LabelSection label={"Role"} className="mr-5">
                <PolText>{dropdowns.Roles.find((x) => x.id === roleId)?.Title}</PolText>
              </LabelSection>

              <LabelSection label={"Task"} className="mr-5">
                <PolText>{dropdowns.Tasks.find((x) => x.id === taskId)?.Title}</PolText>
              </LabelSection>

              <LabelSection label={"Sub Task"} className="mr-5">
                <PolText>{dropdowns.SubTasks.find((x) => x.id === subtaskId)?.Title}</PolText>
              </LabelSection>

              <LabelSection label={"Description"} className="mr-5">
                <PolText>{description}</PolText>
              </LabelSection>
            </div>
          </div>
        </PolTableCell>
        <PolTableCell>
          <HoursInput timeActivity={timeBlock.Sunday} isDisabled={isDisabled} dayOfWeek={0} />
        </PolTableCell>
        <PolTableCell>
          <HoursInput timeActivity={timeBlock.Monday} isDisabled={isDisabled} dayOfWeek={1} />
        </PolTableCell>
        <PolTableCell>
          <HoursInput timeActivity={timeBlock.Tuesday} isDisabled={isDisabled} dayOfWeek={2} />
        </PolTableCell>
        <PolTableCell>
          <HoursInput timeActivity={timeBlock.Wednesday} isDisabled={isDisabled} dayOfWeek={3} />
        </PolTableCell>
        <PolTableCell>
          <HoursInput timeActivity={timeBlock.Thursday} isDisabled={isDisabled} dayOfWeek={4} />
        </PolTableCell>
        <PolTableCell>
          <HoursInput timeActivity={timeBlock.Friday} isDisabled={isDisabled} dayOfWeek={5} />
        </PolTableCell>
        <PolTableCell>
          <HoursInput timeActivity={timeBlock.Saturday} isDisabled={isDisabled} dayOfWeek={6} />
        </PolTableCell>
        <PolTableCell>
          <PolText className="text-center">{tryGetSum(times.map((x) => x?.Hours ?? 0))}</PolText>
        </PolTableCell>
      </PolTableRow>
    </>
  );
};

interface HoursInputProps {
  timeActivity: TimeActivity;
  isDisabled: boolean;
  dayOfWeek: number;
}

function HoursInput({ timeActivity, dayOfWeek }: HoursInputProps) {
  const [hours, setHours] = useState(timeActivity?.Hours || "");

  useEffect(() => {
    setHours(timeActivity?.Hours || "");
  }, [timeActivity?.Hours]);

  return <PolInput className="text-center" type="number" value={hours} isDisabled={true} />;
}
