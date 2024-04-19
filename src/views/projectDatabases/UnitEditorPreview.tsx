import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { useProjectDatabaseViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/index.lazy";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";

const UnitEditorPreview = () => {
  const { projectDatabaseId } = useProjectDatabaseViewParams();
  const navigate = usePolNavigate();
  const unitRequest = usePartialDbQuery(LightingFixtureUnit, `WHERE c.ProjectDatabaseId = "${projectDatabaseId}"`, 1);
  return (
    <Card>
      <CardHeader>
        <PolText type="large">Equipment Units</PolText>
      </CardHeader>
      <CardContent>
        <div className="mb-2 grid grid-flow-row text-left">
          <PolRequestPresenter
            request={unitRequest}
            onLoading={() => <Skeleton className="h-4 w-4"></Skeleton>}
            onSuccess={() => <PolText type="bold">{unitRequest.data.ItemCount.toString()}</PolText>}
          ></PolRequestPresenter>
          <PolText type="muted">units used</PolText>
        </div>
        <div className="flex gap-5">
          <PolButton
            variant="secondary"
            onClick={() =>
              navigate({ to: "/project-databases/$projectDatabaseId/equipment-units", params: { projectDatabaseId } })
            }
          >
            Details
          </PolButton>
          <PolButton
            variant="secondary"
            onClick={() =>
              navigate({
                to: "/project-databases/$projectDatabaseId/equipment-units/qr-codes",
                params: { projectDatabaseId },
              })
            }
          >
            Print
          </PolButton>
          <a className="ml-auto flex w-fit items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:cursor-pointer hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm">
            Editor
            <PolIcon stroke="var(--primary-500)" source="google" name="chevron_right"></PolIcon>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitEditorPreview;
