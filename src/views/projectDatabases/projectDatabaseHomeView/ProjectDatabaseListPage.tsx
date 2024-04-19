import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import IconText from "@/components/polComponents/IconText";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import PolModal from "@/components/polComponents/PolModal";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { Seo } from "@/components/polComponents/Seo";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import { useLocalStorageState } from "@/customHooks/useLocalStorageState";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import { ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import { InvoiceStatus } from "@/sdk/enums/InvoiceStatus";
import { Theme, useMediaQuery } from "@mui/material";
import { Moment } from "moment";
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import CreateProjectDatabaseView from "../CreateProjectDatabase";
import ProjectDatabaseListNavCards from "./ProjectDatabaseListNavCard";
import ProjectDatabaseLogoViewer from "./ProjectDatabaseLogoViewer";
import ProjectDatabaseSidebar from "./ProjectDatabaseSidebar";

interface Filters {
  customers?: string[];
  endDate?: Moment;
  name?: string;
  startDate?: Moment;
  status?: InvoiceStatus;
}

interface InvoicesSearchState {
  filters: Filters;
  page: number;
  rowsPerPage: number;
}

const useInvoicesSearch = () => {
  const [state, setState] = useState<InvoicesSearchState>({
    filters: {
      customers: [],
      endDate: undefined,
      name: "",
      startDate: undefined,
    },
    page: 0,
    rowsPerPage: 5,
  });

  const handleFiltersChange = useCallback((filters: Filters): void => {
    setState((prevState) => ({
      ...prevState,
      filters,
      page: 0,
    }));
  }, []);

  const handlePageChange = useCallback((event: any | null, page: number): void => {
    setState((prevState) => ({
      ...prevState,
      page,
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setState((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10),
    }));
  }, []);

  return {
    handleFiltersChange,
    handlePageChange,
    handleRowsPerPageChange,
    state,
  };
};

interface InvoicesStoreState {
  invoices: Invoice[];
  invoicesCount: number;
}

export default function ProjectDatabaseListView() {
  const navigate = usePolNavigate();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const invoicesSearch = useInvoicesSearch();
  const query = useMemo(() => {
    let result = "WHERE";
    const filters = invoicesSearch.state.filters;

    if (filters.startDate) {
      result += ` StartDate >= "${filters.startDate}"`;
    }
    if (filters.endDate) {
      result += ` EndDate <= "${filters.endDate}"`;
    }
    if (filters.name) {
      result += ` c.Name CONTAINS "${filters.name}"`;
    }
    // if (filters.customers){
    //   result += ` Query("ae59b518-c975-4709-9445-cb14377809e7", c.ProjectId).ClientId IN ["${filters.customers.join(",")}"]`;
    // }
    // if (filters.status){
    //   result += ` Status = ${filters.status}`;
    // }
    return result;
  }, [invoicesSearch.state]);
  const projectDatabaseRequest = usePartialDbQuery(ProjectDatabase, query, 10);
  const [group, setGroup] = useState<boolean>(true);
  const [openSidebar, setOpenSidebar] = useLocalStorageState<boolean>("pg-drawer-open", lgUp);

  const handleGroupChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setGroup(event.target.checked);
  }, []);

  const handleFiltersToggle = useCallback((): void => {
    setOpenSidebar((prevState) => !prevState);
  }, []);

  const handleFiltersClose = useCallback((): void => {
    setOpenSidebar(false);
  }, []);

  const [isCreateNewModalOpen, setIsCreateNewModalOpen] = useState(false);
  return (
    <>
      <Seo title="Project Databases" />
      <div className="grid-auto-row spacing-4 grid md:p-16">
        <div className="flex-start flex-auto-row space-between spacing-4 flex px-6 ">
          <div>
            <PolHeading size={4}>Project Databases</PolHeading>
          </div>
          <div className="mb-10 ml-auto grid grid-flow-col space-x-4 align-middle">
            <PolButton variant="ghost" onClick={handleFiltersToggle}>
              <IconText iconName="Filter" text="Filters" />
            </PolButton>

            <PolModal
              isOpen={isCreateNewModalOpen}
              onOpenChanged={(value) => setIsCreateNewModalOpen(value)}
              modalTrigger={
                <PolButton>
                  <IconText iconName="Plus" text="New" className="stroke-white stroke-2 text-white" />
                </PolButton>
              }
            >
              <CreateProjectDatabaseView
                onSaved={() => projectDatabaseRequest.refetch().then((x) => setIsCreateNewModalOpen(false))}
              />
            </PolModal>
          </div>
        </div>
        <ProjectDatabaseListNavCards />

        <EntityTableWithPagination
          addons={[]}
          request={projectDatabaseRequest}
          onRowClicked={(x) =>
            navigate({ to: "/project-databases/$projectDatabaseId", params: { projectDatabaseId: x.id } })
          }
          isVirtualized={true}
          showSearch={false}
          dense={false}
          columns={[
            {
              id: "",
              width: 100,
              renderCell: (x) => <ProjectDatabaseLogoViewer logoId={x.DocumentLogoId} />,
            },
            {
              width: 100,
              renderCell: (x) => <ProjectDatabaseLogoViewer logoId={x.ClientDocumentLogoId} />,
            },
            { id: "Name" },
          ]}
          orderByProperty="Name"
          mobileRowTemplate={(x, index, props) => (
            <div
              className="mobile-card-item grid grid-flow-col"
              onClick={() =>
                navigate({ to: "/project-databases/$projectDatabaseId", params: { projectDatabaseId: x.id } })
              }
              tabIndex={-1}
              key={x.id}
              {...props}
            >
              <div className="grid grid-flow-row">
                <span className="text-left font-medium">{x.Name}</span>
              </div>
            </div>
          )}
        ></EntityTableWithPagination>
      </div>
    </>
  );
}
