import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { PunchList } from "@/sdk/entities/punchList/PunchList";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";

import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import PolText from "@/components/polComponents/PolText";
import { ChevronDown, Filter, Loader2Icon, Search, X } from "lucide-react";
import { Status } from "@/sdk/enums/Status";
import { User } from "@/sdk/entities/core/User";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import UserProfilePicture from "@/components/navbar/UserProfilePicture";
import PunchListItemPriority from "./PunchListItemPriority";
import NewPunchListItem from "./crud/NewPunchListItem";
import { usePunchListHomeViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/punch-lists/index.lazy";
import FinishPunchListItem from "./crud/FinishPunchListItem";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PolIcon from "@/components/PolIcon";
import DeletePunchListItem from "./crud/DeletePunchListItem";
import CopyPunchListItemLink from "./crud/CopyPunchListItemLink";
import EditPunchListItemPriority from "./crud/EditPunchListItemPriority";
import EditPunchList from "./crud/EditPunchList";
import { EditPunchListItem } from "./crud/EditPunchListItem";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { CreatePunchList } from "./crud/CreatePunchList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PunchListGridView from "./grid/PunchListGridView";
import UserAssignments from "./UserAssignments";
import CheckListCardView from "./CheckListCardView";
import { ScrollArea } from "@/components/ui/scroll-area";
import EntitySearch from "@/components/EntitySearch";
import PunchListSearch from "./PunchListSearch";
import PunchLIstCharts from "./chart/PunchListCharts";
import PunchListCharts from "./chart/PunchListCharts";
import CircleCheckBox from "@/components/polComponents/CircleCheckBox";
import { PunchListItemContainer } from "./PunchListItemContainer";
import PunchListItemsFilter from "./PunchListItemsFilter";

export default function PunchListHomeView() {
  const { projectDatabaseId } = usePunchListHomeViewParams();

  const [punchListItemId, setPunchListItemId] = useSearchParamState("punchListItemId", "");
  const [view, setView] = useSearchParamState("view", "board");
  const punchListRequest = useDbQuery(PunchList, `WHERE c.ProjectDatabaseId = "${projectDatabaseId}"`);
  const punchListItemRequest = useDbQueryFirst(PunchListItem, `WHERE c.id = "${punchListItemId}"`, {
    enabled: isUsable(punchListItemId),
  });

  const [searchText, setSearchText] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      setView("grid");
    }
  };
  const [filters, setFilters] = useState<{ property: string; entityId: string }[]>([]);

  return (
    <div className="m-4 flex">
      <Tabs value={view} defaultValue={view} onValueChange={setView} className="w-full">
        <div className="w-app ">
          <TabsList className="mx-auto flex w-fit gap-2">
            <PolRequestPresenter
              containerClassName="w-fit"
              request={punchListRequest}
              onSuccess={() => (
                <>
                  {view === "grid" && (
                    <PunchListItemsFilter
                      onFilterChange={setFilters}
                      filters={filters}
                      punchLists={punchListRequest.data}
                    ></PunchListItemsFilter>
                  )}
                </>
              )}
            ></PolRequestPresenter>
            <PolInput
              onKeyDown={handleKeyDown}
              onValueChanged={setSearchText}
              value={searchText}
              placeholder="Search"
              className=" pl-6"
              overlayElement={
                searchText === "" ? (
                  <Search stroke="gray" size={15} className="my-auto ml-2"></Search>
                ) : (
                  <X
                    stroke="gray"
                    size={15}
                    className="my-auto ml-2 hover:cursor-pointer"
                    onClick={() => setSearchText("")}
                  ></X>
                )
              }
            ></PolInput>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            {isLoading && <Loader2Icon className="animate-spin"></Loader2Icon>}
          </TabsList>
        </div>
        <PolRequestPresenter
          containerClassName="mt-4"
          request={punchListRequest}
          onSuccess={() => (
            <>
              <TabsContent value="board" className="flex gap-2">
                {punchListItemId && (
                  <PolRequestPresenter
                    request={punchListItemRequest}
                    onSuccess={() => (
                      <>
                        <EditPunchListItem
                          openDefault={true}
                          punchListItem={punchListItemRequest.data}
                          onClose={() => setPunchListItemId("")}
                        ></EditPunchListItem>
                      </>
                    )}
                  ></PolRequestPresenter>
                )}
                {punchListRequest.data.map((punchList) => {
                  return <PunchListContainer punchList={punchList}></PunchListContainer>;
                })}
                <CreatePunchList onCreated={punchListRequest.refetch}></CreatePunchList>
              </TabsContent>
              <TabsContent value="grid" className="p-4">
                <PunchListGridView
                  filters={filters}
                  search={searchText}
                  onIsLoadingChange={setIsLoading}
                  punchLists={punchListRequest.data}
                ></PunchListGridView>
              </TabsContent>
              <TabsContent value="charts">
                <PunchListCharts onIsLoadingChange={setIsLoading} punchLists={punchListRequest.data}></PunchListCharts>
              </TabsContent>
            </>
          )}
        ></PolRequestPresenter>
      </Tabs>
    </div>
  );
}

function PunchListContainer({ punchList }: { punchList: PunchList }) {
  const notStartedPunchListItems = useDbQuery(
    PunchListItem,
    `WHERE c.PunchListId = '${punchList.id}' and c.Status = 0`,
    { staleTime: 0 },
  );

  const completedPunchListItems = useDbQuery(
    PunchListItem,
    `WHERE c.PunchListId = '${punchList.id}' and c.Status = 2`,
    { staleTime: 0 },
  );

  return (
    <div className="flex flex-col gap-2">
      <EditPunchList punchList={punchList}></EditPunchList>
      <NewPunchListItem
        punchListId={punchList.id}
        onItemCreated={() => {
          notStartedPunchListItems.refetch();
          completedPunchListItems.refetch();
        }}
        trigger={
          <PolButton className="w-full text-blue-500 hover:bg-white hover:shadow-md" variant="outline">
            + Add Task
          </PolButton>
        }
      ></NewPunchListItem>

      <PolRequestPresenter
        containerClassName="flex flex-col gap-2"
        request={[notStartedPunchListItems, completedPunchListItems]}
        onSuccess={() => (
          <>
            <PunchListItemsList
              refetches={[notStartedPunchListItems.refetch, completedPunchListItems.refetch]}
              punchListItems={notStartedPunchListItems.data}
            ></PunchListItemsList>

            <CompletePunchListItemsList punchListItems={completedPunchListItems.data}></CompletePunchListItemsList>
          </>
        )}
      />
    </div>
  );
}

function CompletePunchListItemsList({ punchListItems }: { punchListItems: PunchListItem[] }) {
  const [open, setOpen] = useState(false);

  if (punchListItems.length === 0) {
    return null;
  }

  const toggleOpen = () => {
    document.getElementById(`down-${punchListItems[0].id}`)?.classList.toggle("animate-180-out");
    document.getElementById(`down-${punchListItems[0].id}`)?.classList.toggle("animate-180-in");
    setOpen((prev) => !prev);
  };

  return (
    <>
      <PolButton className="w-full hover:bg-white hover:shadow-md " variant="outline" onClick={toggleOpen}>
        <span className="flex w-full items-center justify-center gap-2">
          Hide Completed{" "}
          <ChevronDown id={`down-${punchListItems[0].id}`} className="animate-180-out" size={15}></ChevronDown>
        </span>
      </PolButton>
      {open && (
        <div className="flex flex-col gap-2">
          {punchListItems.map((punchListItem) => {
            return <PunchListItemContainer punchListItem={punchListItem}></PunchListItemContainer>;
          })}
        </div>
      )}
    </>
  );
}

function PunchListItemsList({
  punchListItems,
  refetches,
}: {
  punchListItems: PunchListItem[];
  refetches?: (() => void)[];
}) {
  if (punchListItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {punchListItems.map((punchListItem) => {
        return <PunchListItemContainer refetches={refetches} punchListItem={punchListItem}></PunchListItemContainer>;
      })}
    </div>
  );
}
