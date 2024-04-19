import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import PolText from "@/components/polComponents/PolText";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { Role } from "@/sdk/entities/billing/Role";
import { SubTask } from "@/sdk/entities/billing/SubTask";
import { Task } from "@/sdk/entities/billing/Task";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { User } from "@/sdk/entities/core/User";
import { tryGetSum } from "@/sdk/utils/arrayUtils";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import React from "react";

export function HighUsageTimeView({ items }: { items: TimeActivity[] }) {
  const refItem = items[0];
  const userRequest = useDbQueryFirst(User, `WHERE c.id = "${refItem.UserId}"`);
  const roleRequest = useDbQueryFirst(Role, `WHERE c.id = "${refItem.RoleId}"`);
  const taskRequest = useDbQueryFirst(Task, `WHERE c.id = "${refItem.TaskId}"`);
  const subtaskRequest = useDbQueryFirst(SubTask, `WHERE c.id = "${refItem.SubTaskId}"`, {
    enabled: isUsable(refItem.SubTaskId),
  });
  return (
    <PolRequestPresenter
      containerClassName="h-auto w-auto m-2 w-96 bg-secondary-100 rounded p-5 border hover:scale-[1.03] transition cursor-pointer"
      request={[userRequest, taskRequest, subtaskRequest]}
      showWhenNullResults={true}
      showWhenPending={true}
      onLoading={() => (
        <div className="gap-2">
          <div className="grid h-auto grid-flow-col grid-cols-[1fr_1fr] gap-2">
            <PolSkeleton className="h-5" />
            <PolSkeleton className="h-5" />
          </div>
          <PolSkeleton className="mt-2 h-4" />
        </div>
      )}
      onSuccess={() => (
        <>
          <div className="grid h-auto grid-flow-col grid-cols-[auto_1fr] gap-2">
            <PolText type="lead">{getFullName(userRequest.data.Person)}</PolText>
            <PolText type="lead" className="ml-auto">
              {toUsdString(tryGetSum(items.map((x) => x.BillableRate * x.Hours)))}
            </PolText>
          </div>
          <div className="flex flex-row">
            <PolText type="muted">{roleRequest.data?.Title ?? "Unknown"}</PolText>
            {refItem.TaskId && (
              <PolText type="muted" className="ml-1">
                - {taskRequest.data?.Title ?? "Unknown"}
              </PolText>
            )}
            {refItem.SubTaskId && (
              <PolText type="muted" className="ml-1">
                - {subtaskRequest.data?.Title ?? "Unknown"}
              </PolText>
            )}
          </div>
        </>
      )}
    />
  );
}
