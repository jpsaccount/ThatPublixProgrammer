import PolIcon from "@/components/PolIcon";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import { PolButton } from "@/components/polComponents/PolButton";
import PolModal from "@/components/polComponents/PolModal";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { EquipmentConfigurationGroup } from "@/sdk/entities/project/EquipmentConfigurationGroup";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useState } from "react";
import EquipmentTypeGroupDetailView from "./EquipmentTypeGroupDetailView";

export default function EquipmentTypeGroupListView() {
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate('WHERE c.Name Contains "{0}" AND c.');
  const equipmentTypeGroupsRequest = usePartialDbQuery(EquipmentConfigurationGroup, query, 20);
  const navigate = usePolNavigate();
  const upsertEquipment = useDbUpsert(EquipmentConfigurationGroup);
  const [equipmentTypeGroup, setEquipmentTypeGroup] = useState(null);
  async function createEquipment() {
    let equipment = new EquipmentConfigurationGroup();
    equipment = await upsertEquipment.mutateAsync(equipment);
    navigate({ to: "/equipment-type-groups/$equipmentTypeGroupId", params: { equipmentTypeGroupId: equipment.id } });
  }

  return (
    <>
      <EntityTableWithPagination
        addons={[
          <PolModal
            isOpen={isUsable(equipmentTypeGroup)}
            modalTrigger={
              <PolButton
                onClick={() => setEquipmentTypeGroup(new EquipmentConfigurationGroup())}
                variant="ghost"
                className="mx-2 ml-0 mr-auto w-fit md:ml-2"
              >
                <PolIcon name="Plus" />
              </PolButton>
            }
          >
            <EquipmentTypeGroupDetailView
              equipmentTypeGroup={equipmentTypeGroup}
              onSave={() => {
                equipmentTypeGroupsRequest.refetch();
                setEquipmentTypeGroup(null);
              }}
            />
          </PolModal>,
        ]}
        request={equipmentTypeGroupsRequest}
        onRowClicked={(x) =>
          navigate({ to: "/equipment-type-groups/$equipmentTypeGroupId", params: { equipmentTypeGroupId: x.id } })
        }
        isVirtualized={true}
        showSearch={true}
        dense={false}
        searchText={searchText}
        onSearchTextChanged={setSearchText}
        columns={[{ idGetter: (x) => x.Name, label: "Name", id: "Name" }, { id: "Description" }]}
        orderByProperty="Name"
        mobileRowTemplate={(x, index, props) => (
          <div
            className="mobile-card-item grid grid-flow-col"
            onClick={() =>
              navigate({ to: "/equipment-type-groups/$equipmentTypeGroupId", params: { equipmentTypeGroupId: x.id } })
            }
            tabIndex={-1}
            key={x.id}
            {...props}
          >
            <div className="grid grid-flow-row">
              <span className="text-left font-medium">{x.Name}</span>
              <span className="text-left text-xs">{x.Description}</span>
            </div>
          </div>
        )}
      />
    </>
  );
}
