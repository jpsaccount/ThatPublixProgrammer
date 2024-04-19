import EntitySearch from "@/components/EntitySearch";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { usePunchListHomeViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/punch-lists/index.lazy";
import { PunchList } from "@/sdk/entities/punchList/PunchList";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";

interface Props {
  punchLists: PunchList[];
}

export default function PunchListSearch({ punchLists }: Props) {
  const navigate = usePolNavigate();
  const { projectDatabaseId } = usePunchListHomeViewParams();
  return (
    <EntitySearch
      defaultSearch={`c.PunchListId IN [${punchLists.map((x) => `"` + x.id + `"`)}]`}
      matchProperties={["Title", "Description"]}
      itemTemplate={(item) => (
        <span
          onClick={() =>
            navigate({
              to: "/project-databases/$projectDatabaseId/punch-lists",
              params: { projectDatabaseId },
              search: { view: "board", punchListItemId: item.id },
            })
          }
          className="rounded p-1 hover:cursor-pointer hover:bg-gray-200"
        >
          {item.Title}
        </span>
      )}
      entityType={PunchListItem}
    ></EntitySearch>
  );
}
