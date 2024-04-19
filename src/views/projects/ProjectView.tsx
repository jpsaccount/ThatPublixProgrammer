import MultiForm from "@/components/MultiForm";
import PolIcon from "@/components/PolIcon";
import { ColumnOrder } from "@/components/polComponents/EntityTableViews/EntityTableView";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import { PolButton } from "@/components/polComponents/PolButton";
import PolModal from "@/components/polComponents/PolModal";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import { Seo } from "@/components/polComponents/Seo";
import useDbCaching from "@/customHooks/sdkHooks/useDbCaching";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useQueryTemplate from "@/customHooks/sdkHooks/useQueryTemplate";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { Client } from "@/sdk/entities/project/Client";
import { Project } from "@/sdk/entities/project/Project";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import {
  NewProjectClientEntry,
  NewProjectDetailEntry,
} from "@/views/projects/CreateNewProjectForm/NewProjectDetailEntry";
import NewProjectReview from "@/views/projects/CreateNewProjectForm/NewProjectReview";
import { useState } from "react";

export default function ProjectView() {
  const [orderBy, setOrderBy] = useState<ColumnOrder>({ propertyName: "Nickname", order: "asc" });
  const { query, searchText, setSearchText } = useQueryTemplate(
    `Order By c.${orderBy.propertyName} ${orderBy.order}`,
    `Order by c.${orderBy.propertyName} ${orderBy.order}`,
  );
  const projectRequest = usePartialDbQuery(Project, query, 50);
  const { setToQuery: addToCache } = useDbCaching();

  const clientRequest = useDbQuery(
    Client,
    `WHERE c.id IN [${projectRequest.data?.Items?.map((x) => `"${x.ClientId}"`)}]`,
    { enabled: isUsable(projectRequest.data?.Items) },
  );

  const navigate = usePolNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [newProject, setNewProject] = useState(new Project());

  const upsert = useDbUpsert(Project);

  function updateProject(project: Partial<Project>) {
    setNewProject((x) => {
      return { ...x, ...project };
    });
  }

  const CreateProject = async () => {
    try {
      const createdProject = await upsert.mutateAsync(newProject);
      addToCache(Project, createdProject);
      navigate({ to: "/projects/$projectId", params: { projectId: createdProject.id } });
      setNewProject(new Project());
      return true;
    } catch (e) {
      console.log(e);
    }
  };

  const validateCreateProjectStep = (currentStepIndex: number) => {
    if (currentStepIndex === 0) {
      return isNullOrWhitespace(newProject.ClientId) ? "Client needs to be selected" : null;
    } else if (currentStepIndex === 1) {
      if (isNullOrWhitespace(newProject.Name)) {
        return "Project needs a name";
      }
    }
  };

  return (
    <>
      <Seo title="Projects" />
      <PolModal isOpen={isOpen} onOpenChanged={setIsOpen}>
        <MultiForm
          onSuccess={CreateProject}
          validateStep={validateCreateProjectStep}
          className="h-[500px] min-w-[50px]"
          views={[
            ["Client", <NewProjectClientEntry project={newProject} updateProject={updateProject} />],
            ["Detail", <NewProjectDetailEntry project={newProject} updateProject={updateProject} />],
            ["Review", <NewProjectReview project={newProject} updateProject={updateProject} />],
          ]}
        />
      </PolModal>
      <PolRequestPresenter
        request={projectRequest}
        onSuccess={() => (
          <EntityTableWithPagination<Project>
            onRowClicked={(x) => navigate({ to: "/projects/$projectId", params: { projectId: x.id } })}
            onOrderByChanged={(value) => setOrderBy(value)}
            request={projectRequest}
            searchText={searchText}
            addons={[
              <PolButton className="ml-auto md:ml-2" data-testid={"create-button"} onClick={() => setIsOpen(true)}>
                <PolIcon name="FilePlus" isIconFilled={true} fill={"white"}></PolIcon>
              </PolButton>,
            ]}
            onSearchTextChanged={setSearchText}
            dense={false}
            columns={[
              { id: "Nickname" },
              {
                id: "ClientId",
                idGetter: (x) => clientRequest.data?.find((c) => c.id == x.ClientId)?.CompanyName,
                renderCell: (x) => (
                  <PolRequestPresenter
                    request={clientRequest}
                    onSuccess={() => clientRequest.data?.find((c) => c.id == x.ClientId)?.CompanyName}
                    onLoading={() => <PolSkeleton className="h-4 w-48" />}
                  />
                ),
                label: "Client",
              },
              {
                id: "ShowInTimesheet",
                label: "Show in timesheet",
                renderCell: (x) => x.ShowInTimesheet && <PolIcon className="ml-14" name={"CalendarCheck"} />,
              },
            ]}
            orderByProperty="Nickname"
            mobileRowTemplate={(x, index, props) => {
              return (
                <>
                  <div
                    className="mobile-card-item grid grid-flow-col"
                    onClick={() => navigate({ to: "/projects/$projectId", params: { projectId: x.id } })}
                    tabIndex={-1}
                    key={x.id}
                    {...props}
                  >
                    <div className="grid grid-flow-row text-left ">
                      <span className="text-sm">
                        <PolRequestPresenter
                          request={clientRequest}
                          onSuccess={() => clientRequest.data?.find((c) => c.id == x.ClientId).CompanyName}
                          onLoading={() => <PolSkeleton className="h-4 w-48" />}
                        />
                      </span>
                      <span className="font-medium">{x.Nickname}</span>
                    </div>
                    <div className="my-auto ml-auto mr-0 text-right">
                      {x.ShowInTimesheet && <PolIcon size="2rem" isIconFilled={true} name={"Eye"} />}
                    </div>
                  </div>
                </>
              );
            }}
          />
        )}
      />
    </>
  );
}
