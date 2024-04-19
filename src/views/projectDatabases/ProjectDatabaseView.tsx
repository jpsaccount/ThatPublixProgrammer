import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { Seo } from "@/components/polComponents/Seo";
import { useEffect } from "react";
import ProjectDatabaseTitleCard from "./ProjectDatabaseTitleCard";
import UnitEditorPreview from "./UnitEditorPreview";
import PunchListPreview from "./PunchListPreview";
import { useProjectDatabaseViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/index.lazy";
import RevitImportPreview from "./RevitImportPreview";

const ProjectDatabaseView = () => {
  const { projectDatabaseId } = useProjectDatabaseViewParams();

  const projectDatabaseRequest = useDbQueryFirst(ProjectDatabase, `WHERE c.id = "${projectDatabaseId}"`, {
    enabled: isUsable(projectDatabaseId),
  });

  const navigate = usePolNavigate();
  useEffect(() => {
    if (isUsable(projectDatabaseRequest.data) && projectDatabaseRequest.isError) {
      // navigate({to: "/not-found"});
    }
  }, [projectDatabaseRequest.data]);

  if (!isUsable(projectDatabaseRequest.data)) {
    return null;
  }

  return (
    <>
      <Seo title={projectDatabaseRequest.data?.Name} />
      <PolRequestPresenter
        request={projectDatabaseRequest}
        onSuccess={() => (
          <div className="grid min-w-[50%] grid-flow-row grid-rows-[auto_auto_1fr] p-5">
            <ProjectDatabaseTitleCard projectDatabase={projectDatabaseRequest.data}></ProjectDatabaseTitleCard>
            <div className="grid grid-flow-col space-x-5 max-md:grid-flow-row max-md:space-x-0  max-md:space-y-5">
              <RevitImportPreview></RevitImportPreview>
              <UnitEditorPreview></UnitEditorPreview>
              <PunchListPreview></PunchListPreview>
              <Card>
                <CardHeader className="relative flex items-center justify-center">
                  <div className="fixed flex w-[666px] justify-end pe-5"></div>
                </CardHeader>
                <CardContent>
                  <div className="mx-auto mt-4 flex w-fit flex-wrap rounded border">
                    <PolButton variant="ghost">Focus Photos</PolButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      ></PolRequestPresenter>
    </>
  );
};

export default ProjectDatabaseView;
