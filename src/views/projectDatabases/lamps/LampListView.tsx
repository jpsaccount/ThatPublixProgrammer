import EntityTableView from "@/components/polComponents/EntityTableViews/EntityTableView";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolTableCell from "@/components/polComponents/PolTableCell";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { Lamp } from "@/sdk/entities/project/equipment/Lamp";
import { TableRow } from "@mui/material";
import LampDetail from "./LampDetail";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";

const LampListView = () => {
  const goboRequest = useDbQuery(Lamp);

  const [lampId, setLampId] = useSearchParamState("id", "");
  return (
    <>
      <PolRequestPresenter
        request={goboRequest}
        onSuccess={() => (
          <EntityTableView
            onRowClicked={(x) => setLampId(x.id)}
            data={goboRequest.data}
            dense={false}
            columns={[{ id: "Model" }]}
            orderByProperty="Model"
          />
        )}
      ></PolRequestPresenter>
      <Sheet modal={false} open={!isNullOrWhitespace(lampId)} onOpenChange={(e) => !e && setLampId(undefined)}>
        <SheetContent onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          {lampId && <LampDetail></LampDetail>}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default LampListView;
