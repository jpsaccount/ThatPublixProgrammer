import { LabelSection } from "@/components/LabelSection/LabelSection";
import { PolButton } from "@/components/polComponents/PolButton";
import PolText from "@/components/polComponents/PolText";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { ChargeTable } from "@/sdk/entities/billing/ChargeTable";
import { Role } from "@/sdk/entities/billing/Role";
import { SubTask } from "@/sdk/entities/billing/SubTask";
import { Task } from "@/sdk/entities/billing/Task";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { User } from "@/sdk/entities/core/User";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { useState } from "react";

export function TimeActivityItemInsideModal({
  timeActivity,
  addTimeActivity,
}: {
  timeActivity: TimeActivity;
  addTimeActivity: (itemId: string, chargeTableItemType: keyof ChargeTable) => void;
}) {
  const [isAdded, setIsAdded] = useState(false);
  const usersRequest = useDbQueryFirst(User, `WHERE c.id = '${timeActivity.UserId}'`);
  const roleRequest = useDbQueryFirst(Role, `WHERE c.id = '${timeActivity.RoleId}'`);
  const taskRequest = useDbQueryFirst(Task, `WHERE c.id = '${timeActivity.TaskId}'`);
  const subtaskRequest = useDbQueryFirst(SubTask, `WHERE c.id = '${timeActivity.SubTaskId}'`);

  return (
    <Card key={timeActivity.id}>
      <CardHeader className="min-h-8">
        <div className="flex items-center justify-between gap-10">
          <PolText type="bold">Time Activity</PolText>
          <div className="flex space-x-2">
            <PolText type="muted">{getFullName(usersRequest.data?.Person)}</PolText>

            <PolText type="muted">-</PolText>
            <PolText type="muted">{timeActivity.ActivityDate.format("MM-DD-YYYY")}</PolText>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-6 flex flex-col gap-4">
        <div className="flex justify-between">
          <LabelSection label="Role">
            <PolText>{roleRequest.data?.Title}</PolText>
          </LabelSection>
          <LabelSection label="Task">
            <PolText>{taskRequest.data?.Title}</PolText>
          </LabelSection>
          {isNullOrWhitespace(timeActivity.SubTaskId) === false && (
            <LabelSection label="Sub Task">
              <PolText>{subtaskRequest.data?.Title}</PolText>
            </LabelSection>
          )}
        </div>
        {isNullOrWhitespace(timeActivity.Description) === false && (
          <div className="flex justify-between">
            <LabelSection label="Description">
              <PolText>{timeActivity.Description}</PolText>
            </LabelSection>
          </div>
        )}
        <PolButton
          className="w-full"
          disabled={isAdded}
          onClick={() => {
            setIsAdded(true);
            addTimeActivity(timeActivity.id, "TimeActivityItems");
          }}
        >
          {isAdded ? "Added" : "Add"}
        </PolButton>
      </CardContent>
    </Card>
  );
}
