import PolIcon from "@/components/PolIcon";
import UserProfilePicture from "@/components/navbar/UserProfilePicture";
import AddUserDropdown from "@/components/polComponents/GeneralSdkComponents/AddUserDropdown";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolDatePicker } from "@/components/polComponents/PolDatePicker";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolHeading from "@/components/polComponents/PolHeading";
import PolInput from "@/components/polComponents/PolInput";
import PolMutationErrorPresenter from "@/components/polComponents/PolMutationErrorPresenter";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import PolText from "@/components/polComponents/PolText";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { ExpenseReport } from "@/sdk/entities/billing/ExpenseReport";
import { GlobalExpenseReport } from "@/sdk/entities/billing/GlobalExpenseReport";
import { User } from "@/sdk/entities/core/User";
import { Project } from "@/sdk/entities/project/Project";
import { ExpenseReportStatusEnum } from "@/sdk/enums/ExpenseReportStatusEnum";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { AnimatePresence, motion } from "framer-motion";
import { SetStateAction, useEffect, useState } from "react";

interface GlobalExpenseReportDetailViewProps {
  globalExpenseReport: GlobalExpenseReport;
  setGlobalExpenseReport: React.Dispatch<React.SetStateAction<GlobalExpenseReport>>;
  onSave?: () => void | Promise<void>;
}
export default function GlobalExpenseReportDetailView({
  globalExpenseReport,
  setGlobalExpenseReport,
  onSave,
}: GlobalExpenseReportDetailViewProps) {
  function updateGlobalExpenseReport(update: Partial<GlobalExpenseReport>) {
    setGlobalExpenseReport((x) => {
      return { ...x, ...update };
    });
  }

  const saveMutation = useDbUpsert(GlobalExpenseReport);
  const upsertAccess = useDbUpsert(ExpenseReport);
  const deleteAccess = useDbDelete(ExpenseReport);
  const projectsRequest = useDbQuery(Project);
  const userAccessRequest = useDbQuery(ExpenseReport, `WHERE c.GlobalExpenseReportId = '${globalExpenseReport?.id}'`, {
    enabled: isUsable(globalExpenseReport),
  });
  const userRequest = useDbQuery(
    User,
    `WHERE c.id IN ['${userAccessRequest.data?.map((x) => x.UserId).join("','")}']`,
    {
      enabled: isUsable(userAccessRequest.data),
    },
  );

  const [usersToGiveAccess, setUsersToGiveAccess] = useState<Array<User>>([]);

  useEffect(() => {
    setUsersToGiveAccess(userRequest.data);
  }, [userRequest.data]);

  async function save() {
    await saveMutation.mutateAsync(globalExpenseReport);

    const usersAlreadyHasAccess = userAccessRequest.data.map((x) => x.UserId);
    await Promise.all(
      usersToGiveAccess
        .filter((x) => usersAlreadyHasAccess.includes(x.id) === false)
        .map((x) => {
          const expenseReport = new ExpenseReport();
          expenseReport.UserId = x.id;
          expenseReport.GlobalExpenseReportId = globalExpenseReport.id;
          expenseReport.Status = ExpenseReportStatusEnum.Pending;
          return upsertAccess.mutateAsync(expenseReport);
        }),
    );
    const userIdsToGiveAccess = usersToGiveAccess.map((x) => x.id);
    await Promise.all(
      usersAlreadyHasAccess
        .filter((x) => userIdsToGiveAccess.includes(x) === false)
        .map((x) => {
          const access = userAccessRequest.data.find((e) => e.UserId === x);
          return deleteAccess.mutateAsync(access);
        }),
    );
    await userAccessRequest.refetch();
    await (onSave && onSave());
  }

  return (
    <>
      <div className="mt-5 grid min-w-[20dvw] grid-flow-row">
        <div className="grid grid-flow-row p-5">
          <PolHeading size={2}>Details</PolHeading>

          <div className="mt-5 grid grid-flow-col grid-cols-[1fr_2fr] space-x-5">
            <PolInput
              data-testid="titleInput"
              label="Title"
              value={globalExpenseReport?.Title}
              onValueChanged={(x) => updateGlobalExpenseReport({ Title: x })}
            ></PolInput>

            <PolInput
              data-testid="descriptionInput"
              label="Description"
              value={globalExpenseReport?.Description}
              onValueChanged={(x) => updateGlobalExpenseReport({ Description: x })}
            ></PolInput>
          </div>

          <div className="mt-2 grid grid-flow-col grid-cols-[1fr_.5fr_.5fr] space-x-5">
            <PolEntityDropdown
              data-testid="projectDropdown"
              label="Project"
              optionsRequest={projectsRequest}
              nameGetter={(x) => x.Nickname}
              selectedId={globalExpenseReport.ProjectId}
              onValueChanged={(e) => updateGlobalExpenseReport({ ProjectId: e.id })}
            />
            <PolDatePicker
              data-testid="startDatePicker"
              label="Start Date"
              value={globalExpenseReport?.StartDate}
              onValueChanged={(value) => updateGlobalExpenseReport({ StartDate: value })}
            />
            <PolDatePicker
              data-testid="endDatePicker"
              label="End Date"
              value={globalExpenseReport?.EndDate}
              onValueChanged={(value) => updateGlobalExpenseReport({ EndDate: value })}
            />
          </div>
        </div>

        <hr className="my-5" />

        <PolRequestPresenter
          request={[userAccessRequest, userRequest]}
          onLoading={() => (
            <div className=" grid min-h-48 grid-flow-row p-5">
              <div className="grid grid-flow-col">
                <PolHeading size={2}>Users</PolHeading>
                <div>
                  <PolSkeleton className="h-8" />
                </div>
              </div>

              <div className="mt-2 flex h-[27.5dvh] flex-col overflow-auto rounded border">
                {[0, 0, 0].map((x) => {
                  return (
                    <>
                      <div className="grid w-full grid-flow-col grid-cols-[auto_1fr] space-x-4 border-b border-solid border-background-200 p-2 hover:bg-background-50">
                        <PolSkeleton className="rounded-full" />
                        <PolSkeleton className="h-12" />

                        <PolButton variant="ghost" className="p-2">
                          <PolIcon name="X" />
                        </PolButton>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          )}
          onSuccess={() => (
            <GlobalExpenseReportAccessView
              globalExpenseReport={globalExpenseReport}
              usersToGiveAccess={usersToGiveAccess}
              setUsersToGiveAccess={setUsersToGiveAccess}
            />
          )}
        />

        <PolMutationErrorPresenter mutation={saveMutation} className="m-auto" />

        <PolButton data-testid="saveButton" className="min-w-25 m-auto mt-5" onClick={save}>
          Save
        </PolButton>
      </div>
    </>
  );
}

interface GlobalExpenseReportAccessViewProps {
  globalExpenseReport: GlobalExpenseReport;
  usersToGiveAccess: User[];
  setUsersToGiveAccess: React.Dispatch<SetStateAction<User[]>>;
}

function GlobalExpenseReportAccessView({
  globalExpenseReport,
  setUsersToGiveAccess,
  usersToGiveAccess,
}: GlobalExpenseReportAccessViewProps) {
  return (
    <div className=" grid min-h-48 grid-flow-row p-5">
      <div className="grid grid-flow-col">
        <PolHeading size={2}>Users</PolHeading>
        <div>
          <AddUserDropdown
            data-testid={"userDropdown"}
            users={usersToGiveAccess}
            addUser={(user) => setUsersToGiveAccess((x) => [...x, user])}
          />
        </div>
      </div>

      <div className="mt-2 flex h-[27.5dvh] flex-col overflow-auto rounded border">
        <AnimatePresence>
          {usersToGiveAccess?.map((x) => {
            return (
              <>
                <div className="grid w-full grid-flow-col grid-cols-[auto_1fr] space-x-4 border-b border-solid border-background-200 p-2 hover:bg-background-50">
                  <UserProfilePicture userId={x.id} className="mx-2 h-10 w-10" size="1rem" />
                  <PolText className="my-auto">{getFullName(x.Person)}</PolText>

                  <PolButton
                    variant="ghost"
                    className="p-2"
                    onClick={() => setUsersToGiveAccess((users) => users.filter((i) => i.id != x.id))}
                  >
                    <PolIcon name="X" />
                  </PolButton>
                </div>
              </>
            );
          })}

          {usersToGiveAccess?.length === 0 && (
            <motion.div transition={{ duration: 3 }} animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
              <PolText className="my-5 text-center">
                No users attached to this expense report. You can do this later.
              </PolText>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
