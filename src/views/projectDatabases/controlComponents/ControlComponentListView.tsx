import EntityTableView from "@/components/polComponents/EntityTableViews/EntityTableView";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { ControlComponent } from "@/sdk/entities/project/equipment/ControlComponent";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import ControlComponentDetailView from "./ControlComponentDetailView";

const ControlComponentListView = () => {
  const controlComponentRequest = useDbQuery(ControlComponent);

  const [controlComponentId, setControlComponentId] = useSearchParamState("id", "");
  return (
    <>
      <PolRequestPresenter
        request={controlComponentRequest}
        onSuccess={() => (
          <EntityTableView
            onRowClicked={(x) => setControlComponentId(x.id)}
            data={controlComponentRequest.data}
            dense={false}
            columns={[{ id: "Title" }]}
            orderByProperty="Title"
          />
        )}
      ></PolRequestPresenter>
      <Sheet
        modal={false}
        open={!isNullOrWhitespace(controlComponentId)}
        onOpenChange={(e) => !e && setControlComponentId(undefined)}
      >
        <SheetContent onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          {controlComponentId && <ControlComponentDetailView></ControlComponentDetailView>}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ControlComponentListView;
