import EntityTableWithHeader from "@/components/polComponents/EntityTableViews/EntityTableWithHeader";
import { Seo } from "@/components/polComponents/Seo";
import { useAuth } from "@/customHooks/auth";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { ExpenseReport } from "@/sdk/entities/billing/ExpenseReport";
import { GlobalExpenseReport } from "@/sdk/entities/billing/GlobalExpenseReport";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import GlobalExpenseReportMobileItemView from "./GlobalExpenseReportView";

export default function GlobalExpenseReportsUserPage() {
  const { user } = useAuth();
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(
    `WHERE Query('138a868d-764c-4cb5-847d-b9f892b94148', c.GlobalExpenseReportId).Title contains "{0}"
    OR Query('138a868d-764c-4cb5-847d-b9f892b94148', c.GlobalExpenseReportId).Description contains "{0}"
    AND c.UserId = "${user.id}"`,
    `WHERE c.UserId = "${user.id}"`,
  );

  const globalExpenseReportRequest = useDbQuery(GlobalExpenseReport);
  const expenseReports = useDbQuery(ExpenseReport, query, { enabled: isUsable(globalExpenseReportRequest.data) });

  const navigate = usePolNavigate();

  return (
    <>
      <Seo title="Expense Reports" />
      <div className="min-md:w-[60dvw]">
        <EntityTableWithHeader
          headerClassName="sticky top-[48px]"
          searchText={searchText}
          onSearchTextChanged={setSearchText}
          pageTitle="Expense Reports"
          onRowClicked={(x) => navigate({ to: x.GlobalExpenseReportId + "/" + x.id })}
          data={expenseReports.data}
          dense={false}
          columns={[
            {
              id: "StartDate",
              label: "Start Date",
              width: 75,
              idGetter: (x) =>
                globalExpenseReportRequest.data
                  ?.find((i) => i.id == x.GlobalExpenseReportId)
                  ?.StartDate?.format("MM/DD/YYYY"),
            },
            {
              id: "EndDate",
              label: "End Date",
              width: 75,

              idGetter: (x) =>
                globalExpenseReportRequest.data
                  ?.find((i) => i.id == x.GlobalExpenseReportId)
                  ?.EndDate?.format("MM/DD/YYYY"),
            },
            {
              idGetter: (x) => globalExpenseReportRequest.data?.find((i) => i.id == x.GlobalExpenseReportId)?.Title,
            },
            {
              idGetter: (x) =>
                globalExpenseReportRequest.data?.find((i) => i.id == x.GlobalExpenseReportId)?.Description,
            },

            {
              label: "Total",
              idGetter: (x) => toUsdString(x.TotalAmountUsd),
            },
          ]}
          orderByProperty={(x) =>
            globalExpenseReportRequest.data?.find((i) => i.id == x.GlobalExpenseReportId)?.StartDate
          }
          orderByDirection="desc"
          mobileRowTemplate={(x) => {
            const expenseReport = globalExpenseReportRequest.data?.find((i) => i.id == x.GlobalExpenseReportId);
            return <GlobalExpenseReportMobileItemView onClick={() => navigate({ to: x.id })} x={expenseReport} />;
          }}
        />
      </div>
    </>
  );
}
