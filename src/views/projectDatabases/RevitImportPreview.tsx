import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { cn } from "@/lib/utils";
import { ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import { RevitImport } from "@/sdk/entities/project/equipment/revit/RevitImport";
import { useEffect, useState } from "react";
import RevitAssignmentSettings from "./revitImporter/RevitAssignmentSettings";
import { useProjectDatabaseViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/index.lazy";

const RevitImportPreview = () => {
  const { projectDatabaseId } = useProjectDatabaseViewParams();
  const navigate = usePolNavigate();
  const [isAssigned, setIsAssigned] = useState(true);

  const projectDatabaseRequest = useDbQueryFirst(ProjectDatabase, `WHERE c.id = "${projectDatabaseId}"`);

  useEffect(() => {
    // Check if projectDatabaseRequest is defined and if it has finished loading
    if (projectDatabaseRequest) {
      // Check if projectDatabaseRequest.data is defined before trying to access it
      if (projectDatabaseRequest.data) {
        setIsAssigned(projectDatabaseRequest.data.AssignedParameters?.length > 0);
      } else {
        // Handle the case where projectDatabaseRequest.data is undefined
        console.error("No data returned from database query");
      }
    }
  }, [projectDatabaseRequest]);

  const revitImport = useDbQueryFirst(
    RevitImport,
    `WHERE c.ProjectDatabaseId = "${projectDatabaseId}" ORDER BY c.CreatedDateTime DESC`,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <PolText type="large">Revit</PolText>
        <RevitAssignmentSettings isAssigned={isAssigned}></RevitAssignmentSettings>
      </CardHeader>
      <CardContent>
        <PolRequestPresenter
          request={revitImport}
          onSuccess={() => (
            <div className="mb-2 grid grid-flow-row text-left">
              <PolText type="bold">{revitImport.data?.CreatedDateTime.local().format("YYYY-MM-DD hh:mm A")}</PolText>
              <PolText type="muted">Last import on</PolText>
            </div>
          )}
          onFailure={() => (
            <div className="mb-2 grid grid-flow-row text-left">
              <PolText type="bold">Never exported</PolText>
            </div>
          )}
        ></PolRequestPresenter>
        <div className="ml-auto">
          <PolButton
            disabled={isAssigned == false}
            variant="ghost"
            onClick={() => navigate({ to: "/project-databases/$projectDatabaseId/revit" })}
            className="ml-auto flex w-fit items-center rounded-lg px-2 text-xs  font-medium uppercase text-primary-700 hover:cursor-pointer hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Import / Export
            <PolIcon stroke="var(--primary-500)" source="google" name="chevron_right"></PolIcon>
          </PolButton>

          <div className={cn("subscript-container ml-auto w-fit text-right", isAssigned ? "hidden" : "block")}>
            <p>
              Must <p className=" text-red-500">assign parameters </p> <p>before importing.</p>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevitImportPreview;
