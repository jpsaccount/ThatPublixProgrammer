import PolIcon from "@/components/PolIcon";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { Pattern } from "@/sdk/entities/project/equipment/Pattern";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import EquipmentTypeDetail from "./EquipmentTypeDetail";
import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";
import NewEquipmentType from "./NewEquipmentType";

export default function EquipmentTypeList() {
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(
    'WHERE c.Name Contains "{0}" OR c.Model Contains "{0}"',
  );
  const goboRequest = usePartialDbQuery(EquipmentType, query, 20);

  const [equipmentTypeId, setEquipmentTypeId] = useSearchParamState("id", "");

  return (
    <>
      <EntityTableWithPagination
        addons={[<NewEquipmentType onCreated={() => goboRequest.refetch()}></NewEquipmentType>]}
        pageTitle="Equipment Types"
        request={goboRequest}
        onRowClicked={(x) => setEquipmentTypeId(x.id)}
        isVirtualized={true}
        showSearch={true}
        dense={false}
        searchText={searchText}
        onSearchTextChanged={setSearchText}
        columns={[{ idGetter: (x) => x.Code, label: "Code", id: "Code" }]}
        orderByProperty="Code"
        mobileRowTemplate={(x, index, props) => (
          <div
            className="mobile-card-item grid grid-flow-col"
            onClick={() => setEquipmentTypeId(x.id)}
            tabIndex={-1}
            key={x.id}
            {...props}
          >
            <div className="grid grid-flow-row">
              <span className="text-left font-medium">{x.Code}</span>
            </div>
          </div>
        )}
      />

      <Sheet
        modal={false}
        open={!isNullOrWhitespace(equipmentTypeId)}
        onOpenChange={(e) => !e && setEquipmentTypeId(undefined)}
      >
        <SheetContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="w-1/3 min-w-[350px]"
        >
          {equipmentTypeId && <EquipmentTypeDetail></EquipmentTypeDetail>}
        </SheetContent>
      </Sheet>
    </>
  );
}
