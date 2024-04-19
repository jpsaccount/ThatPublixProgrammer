import PolIcon from "@/components/PolIcon";
import PolHeading from "@/components/polComponents/PolHeading";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { useProjectDatabaseViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/index.lazy";
import { PunchList } from "@/sdk/entities/punchList/PunchList";

export default function PunchListPreview() {
  const { projectDatabaseId } = useProjectDatabaseViewParams();

  const punchListsRequest = useDbQuery(PunchList, `WHERE c.ProjectDatabaseId = "${projectDatabaseId}"`);

  const navigate = usePolNavigate();
  return (
    <Card className="h-fit">
      <CardHeader>
        <PolHeading size={4}>Punch Lists</PolHeading>
      </CardHeader>
      <CardContent>
        <PolRequestPresenter
          request={punchListsRequest}
          onSuccess={() => <PunchListPreviewList punchLists={punchListsRequest.data}></PunchListPreviewList>}
        ></PolRequestPresenter>
      </CardContent>
      <CardFooter>
        <button
          onClick={() =>
            navigate({ to: "/project-databases/$projectDatabaseId/punch-lists", params: { projectDatabaseId } })
          }
          className="ml-auto flex w-fit items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:cursor-pointer hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
        >
          Punch Lists
          <PolIcon stroke="var(--primary-500)" source="google" name="chevron_right"></PolIcon>
        </button>
      </CardFooter>
    </Card>
  );
}

function PunchListPreviewList({ punchLists }: { punchLists: PunchList[] }) {
  return (
    <div className="flex max-h-52  flex-col gap-2 overflow-scroll rounded p-2 shadow-sm">
      {punchLists.map((punchList) => (
        <PunchListPreviewItem punchList={punchList}></PunchListPreviewItem>
      ))}
    </div>
  );
}

function PunchListPreviewItem({ punchList }: { punchList: PunchList }) {
  return (
    <div className="rounded-md border p-4">
      <div className="font-bold text-gray-800">{punchList.Title}</div>
      <div>{punchList.Description}</div>
    </div>
  );
}
