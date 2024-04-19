import PolIcon from "@/components/PolIcon";
import UserProfilePicture from "@/components/navbar/UserProfilePicture";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import { Seo } from "@/components/polComponents/Seo";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { TenantUserAccess } from "@/sdk/entities/auth/TenantUserAccess";
import { ExpenseReport } from "@/sdk/entities/billing/ExpenseReport";
import { GlobalExpenseReport } from "@/sdk/entities/billing/GlobalExpenseReport";
import { User } from "@/sdk/entities/core/User";
import { ExpenseReportStatusEnum } from "@/sdk/enums/ExpenseReportStatusEnum";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useState } from "react";
import GlobalExpenseReportsDetailViewModal from "./GlobalExpenseReportsDetailViewModal";
import { useExpenseReportListViewParams } from "@/routes/_auth/expense/$globalExpenseReportId/index.lazy";

const ExpenseReportListView = () => {
  const { globalExpenseReportId } = useExpenseReportListViewParams();
  const navigate = usePolNavigate();
  const globalExpenseReportRequest = useDbQueryFirst(GlobalExpenseReport, `WHERE c.id = "${globalExpenseReportId}"`);
  const expenseReportRequest = usePartialDbQuery(
    ExpenseReport,
    `WHERE c.GlobalExpenseReportId = "${globalExpenseReportId}"`,
    50,
    { refetchOnMount: "always" },
  );

  const access = useDbQuery(TenantUserAccess);
  const userQuery = `c.id IN ["${access.data?.map((x) => x.UserId).join('","')}"]`;
  const userRequest = useDbQuery(User, "WHERE " + userQuery, {
    enabled: isUsable(access.data),
  });
  const [currentExpenseReportToEdit, setCurrentExpenseReportToEdit] = useState(null);

  return (
    <>
      <Seo title={globalExpenseReportRequest.data?.Title} />
      <GlobalExpenseReportsDetailViewModal
        currentExpenseReport={currentExpenseReportToEdit}
        setCurrentExpenseReport={setCurrentExpenseReportToEdit}
        onSave={() =>
          Promise.all([expenseReportRequest.refetch(), globalExpenseReportRequest.refetch()]).then((x) =>
            setCurrentExpenseReportToEdit(null),
          )
        }
      />
      <div className="min-md:w-[60dvw] grid ">
        <PolRequestPresenter
          request={expenseReportRequest}
          onSuccess={() => (
            <EntityTableWithPagination
              headerClassName="sticky top-[48px]"
              pageTitle={
                <div className="grid grid-flow-row">
                  <div className="flex flex-row">
                    <PolHeading size={1}>{globalExpenseReportRequest.data?.Title}</PolHeading>
                    <PolButton
                      className="mx-5"
                      variant="ghost"
                      onClick={() => setCurrentExpenseReportToEdit(globalExpenseReportRequest.data)}
                    >
                      <PolIcon name="Edit" source="google" />
                    </PolButton>
                  </div>
                  <PolHeading size={4}>{"User Access"}</PolHeading>
                </div>
              }
              showSearch={true}
              onRowClicked={(x) =>
                navigate({
                  to: "/expense/$globalExpenseReportId/$expenseReportId",
                  params: { globalExpenseReportId, expenseReportId: x.id },
                })
              }
              className="min-md:w-[60dvw]"
              request={expenseReportRequest}
              dense={false}
              columns={[
                {
                  id: "Status",
                  align: "center",
                  width: 100,
                  idGetter: (x) => ExpenseReportStatusEnum[x.Status]?.toString(),
                },
                {
                  id: "UserId",
                  width: 300,
                  idGetter: (x) => getFullName(userRequest.data?.find((c) => c.id == x.UserId)?.Person) ?? "",
                  renderCell: (x) => (
                    <PolRequestPresenter
                      request={userRequest}
                      onSuccess={() => getFullName(userRequest.data?.find((c) => c.id == x.UserId)?.Person)}
                      onLoading={() => <PolSkeleton className="h-4 w-48" />}
                    />
                  ),
                  label: "User",
                },
                {
                  id: "TotalAmountUsd",
                  width: 150,
                  label: "Total Amount",
                  align: "right",
                  idGetter: (x) => toUsdString(x.TotalAmountUsd),
                },
                { id: "TotalExpensesCount", width: 150, label: "Total Expenses", align: "left" },
                { id: "Notes" },
              ]}
              orderByProperty="CreatedDateTime"
              mobileRowTemplate={(x) => {
                return (
                  <>
                    <div
                      className="border-top mobile-card-item grid grid-flow-col border-b px-2 py-2.5"
                      onClick={() =>
                        navigate({
                          to: "/expense/$globalExpenseReportId/$expenseReportId",
                          params: { globalExpenseReportId, expenseReportId: x.id },
                        })
                      }
                      tabIndex={-1}
                      key={x.id}
                    >
                      <div className="grid grid-flow-col text-left">
                        <UserProfilePicture userId={x.UserId} className="m-0 h-10 w-10 text-left" size="1.5rem" />
                        <PolRequestPresenter
                          request={userRequest}
                          onSuccess={() => (
                            <span className="m-auto ml-0 text-left font-medium">
                              {" "}
                              {getFullName(userRequest.data?.find((c) => c.id == x.UserId)?.Person)}
                            </span>
                          )}
                          onLoading={() => <PolSkeleton className="h-4 w-48" />}
                        />
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{toUsdString(x.TotalAmountUsd)}</div>
                        <div className="text-xs">{x.TotalExpensesCount} expenses</div>
                      </div>
                    </div>
                  </>
                );
              }}
            />
          )}
        ></PolRequestPresenter>
      </div>
    </>
  );
};

export default ExpenseReportListView;
