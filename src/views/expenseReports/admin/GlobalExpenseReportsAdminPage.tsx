import PolIcon from "@/components/PolIcon";
import EntityTableWithHeader from "@/components/polComponents/EntityTableViews/EntityTableWithHeader";
import { PolButton } from "@/components/polComponents/PolButton";
import { Seo } from "@/components/polComponents/Seo";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { GlobalExpenseReport } from "@/sdk/entities/billing/GlobalExpenseReport";
import { useState } from "react";
import GlobalExpenseReportMobileItemView from "../GlobalExpenseReportView";
import GlobalExpenseReportsDetailViewModal from "../GlobalExpenseReportsDetailViewModal";

const GlobalExpenseReportsAdminPage = () => {
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(
    `WHERE c.Title contains "{0}" OR c.Description contains "{0}"`,
    "ORDER BY c.StartDate desc",
  );
  const globalExpenseReportsRequest = useDbQuery(GlobalExpenseReport, query);

  const navigate = usePolNavigate();

  const [currentExpenseReport, setCurrentExpenseReport] = useState<GlobalExpenseReport>(null);

  console.log(globalExpenseReportsRequest);

  function createNewGlobalExpenseReport() {
    const ge = new GlobalExpenseReport();
    setCurrentExpenseReport(ge);
  }

  return (
    <>
      <GlobalExpenseReportsDetailViewModal
        currentExpenseReport={currentExpenseReport}
        setCurrentExpenseReport={setCurrentExpenseReport}
        onSave={() => globalExpenseReportsRequest.refetch().then((x) => setCurrentExpenseReport(null))}
      />
      <Seo title="Expense Reports" />
      <div className="min-md:w-[60dvw]">
        <EntityTableWithHeader
          headerClassName="sticky top-[48px]"
          searchText={searchText}
          onSearchTextChanged={setSearchText}
          pageTitle="Expense Reports"
          onRowClicked={(x) => navigate({ to: x.id })}
          request={globalExpenseReportsRequest}
          dense={false}
          columns={[
            { id: "Title" },
            { id: "Description" },
            { id: "StartDate", label: "Start Date", idGetter: (x) => x.StartDate?.format("MM/DD/YYYY") },
            { id: "EndDate", label: "End Date", idGetter: (x) => x.EndDate?.format("MM/DD/YYYY") },
            {
              width: 30,
              renderCell: () => (
                <div className="grid rounded-md p-2 hover:bg-secondary-100" data-testid="editButton">
                  <PolIcon name="edit" source="google" className="m-auto"></PolIcon>
                </div>
              ),
              onClick: (x) => setCurrentExpenseReport(x),
            },
          ]}
          orderByProperty="StartDate"
          orderByDirection="desc"
          addons={[
            <>
              <div className=" grid w-full grid-flow-col">
                <PolButton
                  data-testid="addButton"
                  className="mx-auto ml-0 md:ml-2"
                  onClick={createNewGlobalExpenseReport}
                >
                  <PolIcon name="Plus" stroke="var(--text-100)" />
                </PolButton>
                <PolButton className="ml-auto" href="report">
                  <PolIcon name="BarChartHorizontal" stroke="var(--text-100)" />
                </PolButton>
              </div>
            </>,
          ]}
          mobileRowTemplate={(x) => {
            return <GlobalExpenseReportMobileItemView onClick={() => navigate({ to: x.id })} x={x} />;
          }}
        />
      </div>
    </>
  );
};

export default GlobalExpenseReportsAdminPage;
