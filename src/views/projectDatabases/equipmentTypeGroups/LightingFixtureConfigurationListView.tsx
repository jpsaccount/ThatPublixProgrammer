import PolIcon from "@/components/PolIcon";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { EquipmentConfigurationGroup } from "@/sdk/entities/project/EquipmentConfigurationGroup";
import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { LightingFixtureConfiguration } from "@/sdk/entities/project/equipment/LightingFixtureConfiguration";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import NewLightingConfiguration from "./NewLightingFixtureConfiguration";
import { useEquipmentTypeGroupListViewParams } from "@/routes/_auth/equipment-type-groups/$equipmentTypeGroupId/index.lazy";

export default function LightingFixtureConfigurationListView() {
  const { equipmentTypeGroupId } = useEquipmentTypeGroupListViewParams();
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(
    `WHERE (Query("1c104b38-c9e2-4ca3-bde9-189ea6c20590", c.EquipmentId).Nickname Contains "{0}"
    OR Query("6ff2b3bb-f675-4a6e-84bb-0e9aa86a9cbd", c.EquipmentCategoryId).Code Contains "{0}" )
    
    AND c.EquipmentTypeGroupId = "${equipmentTypeGroupId}"`,
    `WHERE c.EquipmentTypeGroupId = "${equipmentTypeGroupId}"`,
  );

  const categories = useDbQuery(EquipmentType);
  const lightingFixtureConfigurationRequest = usePartialDbQuery(LightingFixtureConfiguration, query, 20);
  const equipmentTypeGroup = useDbQueryFirst(EquipmentConfigurationGroup, `WHERE c.id = "${equipmentTypeGroupId}"`);
  const equipment = useDbQuery(
    LightingFixture,
    `WHERE c.id IN ["${lightingFixtureConfigurationRequest.data?.Items?.map((x) => x.EquipmentId).join(`","`)}"]`,
    { enabled: isUsable(lightingFixtureConfigurationRequest.data) },
  );
  const navigate = usePolNavigate();

  return (
    <EntityTableWithPagination
      addons={[
        <NewLightingConfiguration
          onCreated={() => lightingFixtureConfigurationRequest.refetch()}
        ></NewLightingConfiguration>,
      ]}
      pageTitle={
        <div className="grid grid-flow-row">
          <div className="flex flex-row">
            <PolHeading size={1}>
              {isNullOrWhitespace(equipmentTypeGroup.data?.Name) ? "(No Name)" : equipmentTypeGroup.data?.Name}
            </PolHeading>
            <PolButton className="mx-5" variant="ghost">
              <PolIcon name="Edit" source="google" />
            </PolButton>
          </div>
        </div>
      }
      request={lightingFixtureConfigurationRequest}
      onRowClicked={(x) =>
        navigate({
          to: "/equipment-type-groups/$equipmentTypeGroupId/$equipmentTypeId",
          params: { equipmentTypeGroupId: equipmentTypeGroupId, equipmentTypeId: x.id },
        })
      }
      isVirtualized={true}
      showSearch={true}
      dense={false}
      searchText={searchText}
      onSearchTextChanged={setSearchText}
      columns={[
        {
          idGetter: (x) =>
            (categories.data?.find((i) => i.id === x.EquipmentCategoryId)?.Code ?? "...") + x.Index + x.Index2,
          label: "Index",
          id: "Index",
        },
        { id: "Equipment", idGetter: (x) => equipment.data?.find((i) => i.id == x.EquipmentId)?.Nickname ?? "..." },
      ]}
      orderByProperty="Index"
      mobileRowTemplate={(x, index, props) => (
        <div
          className="mobile-card-item grid grid-flow-col"
          onClick={() =>
            navigate({
              to: "/equipment-type-groups/$equipmentTypeGroupId/$equipmentTypeId",
              params: { equipmentTypeGroupId: equipmentTypeGroupId, equipmentTypeId: x.id },
            })
          }
          tabIndex={-1}
          key={x.id}
          {...props}
        >
          <div className="grid grid-flow-row">
            <span className="text-left font-medium">{`${x.Index}${x.Index2}`}</span>
          </div>
        </div>
      )}
    />
  );
}
