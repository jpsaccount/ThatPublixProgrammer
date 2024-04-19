import EntityFilterOptionDisplay from "@/components/EntityFilterOptionDisplay";
import EntityFilterPanel from "@/components/EntityFilterPanel";
import PolIcon from "@/components/PolIcon";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import { Seo } from "@/components/polComponents/Seo";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbSearch } from "@/customHooks/sdkHooks/useDbSearch";
import useFilterQueryTemplate from "@/customHooks/sdkHooks/useFilterQueryTemplate";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { LightingFixtureConfiguration } from "@/sdk/entities/project/equipment/LightingFixtureConfiguration";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import { sortBy } from "@/sdk/utils/arrayUtils";
import { getFullPurpose, toEquipmentUnitTitle } from "@/sdk/utils/entityUtils/equipmentUnitUtils";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useMemo, useState } from "react";
import NewEquipmentUnit from "./NewEquipmentUnit";
import { getEntityTypeId } from "@/sdk/sdkconfig/EntityTypeId";
import { useEquipmentUnitListViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/equipment-units/index.lazy";

const EquipmentUnitListView = () => {
  const { projectDatabaseId } = useEquipmentUnitListViewParams();

  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(
    `WHERE c.ProjectDatabaseId = "${projectDatabaseId}" {Filter} AND 
    (c.UnitId Contains "{0}" OR c.Panel Contains "{0}" OR c.Location Contains "{0}" OR c.Description Contains "{0}" OR c.FullPurpose Contains "{0}") 
    ORDER BY c.UnitNumber asc, c.UnitNumberIndex asc, c.UnitLetterIndex asc`,
    `WHERE c.ProjectDatabaseId = "${projectDatabaseId}" {Filter} ORDER BY c.UnitNumber asc, c.UnitNumberIndex asc, c.UnitLetterIndex asc`,
  );

  const [filters, setFilters] = useState(new Map<string, string[]>());
  const punchListItemRequest = useDbQuery(
    PunchListItem,
    `WHERE c.Title != null AND Query("82acb8cb-70ca-4e8b-b869-9b00f43cfd0a", c.PunchListId).ProjectDatabaseId = "${projectDatabaseId}"`,
  );

  const PunchListKey = "PunchListItemTitle";

  const equipmentUnitIds = useMemo(() => {
    const punchListTitles = filters.get(PunchListKey);

    return punchListItemRequest.data
      ?.filter((x) => punchListTitles?.includes(x.Title))
      ?.flatMap((x) => x.TaggedEntities)
      .filter((x) => x.EntityTypeId === getEntityTypeId(LightingFixtureUnit))
      .map((x) => x.EntityId);
  }, [punchListItemRequest.data, filters]);

  const filtersWithPunchListFilter = useMemo(() => {
    const newFilters = new Map(filters);
    newFilters.delete(PunchListKey);
    if (isUsable(equipmentUnitIds) === false || equipmentUnitIds.length === 0) {
      return newFilters;
    }
    newFilters.set("id", equipmentUnitIds);
    return newFilters;
  }, [equipmentUnitIds, filters]);

  const filteredQuery = useFilterQueryTemplate(query, filtersWithPunchListFilter);
  const equipmentUnitsRequest = usePartialDbQuery(LightingFixtureUnit, filteredQuery, 50);

  const locationSearchRequest = useDbSearch(
    LightingFixtureUnit,
    `WHERE c.ProjectDatabaseId = "${projectDatabaseId}" AND c.Location != null`,
  );

  const equipmentConfigurationSearchRequest = useDbSearch(
    LightingFixtureUnit,
    `WHERE c.EquipmentTypeId != null AND c.ProjectDatabaseId = "${projectDatabaseId}"`,
  );

  const equipmentConfigurationRequest = useDbQuery(
    LightingFixtureConfiguration,
    `WHERE c.id IN ["${equipmentConfigurationSearchRequest.data?.join(`","`)}"]`,
    { enabled: isUsable(equipmentConfigurationSearchRequest.data) },
  );

  const equipmentRequest = useDbQuery(
    LightingFixture,
    `WHERE c.id IN ["${equipmentConfigurationRequest.data?.map((x) => x.EquipmentId).join(`","`)}"]`,
    { enabled: isUsable(equipmentConfigurationRequest.data) },
  );

  const typeRequest = useDbQuery(
    EquipmentType,
    `WHERE c.id IN ["${equipmentConfigurationRequest.data?.map((x) => x.EquipmentCategoryId).join(`","`)}"]`,
    { enabled: isUsable(equipmentConfigurationRequest.data) },
  );

  const navigate = usePolNavigate();

  function getEquipmentLabel(id: string) {
    const equipmentConfig = equipmentConfigurationRequest.data?.find((i) => i.id === id);
    const equipment = equipmentRequest.data?.find((i) => i.id == equipmentConfig.EquipmentId);
    const type = typeRequest.data?.find((i) => i.id == equipmentConfig.EquipmentCategoryId);
    return type?.Code + equipmentConfig?.Index + equipmentConfig?.Index2 + ": " + equipment?.Nickname;
  }

  const filterOptions = useMemo(
    () => [
      {
        icon: (hasFilters) => (
          <PolIcon name={"Locate"} className="m-auto" stroke={hasFilters ? "var(--primary-400)" : "var(--text-700)"} />
        ),
        label: "Scene",
        property: "Location",
        options: locationSearchRequest.data?.map((x) => ({ value: x, label: x })) ?? [],
      },
      {
        icon: (hasFilters) => (
          <PolIcon name={"Blocks"} className="m-auto" stroke={hasFilters ? "var(--primary-400)" : "var(--text-700)"} />
        ),
        label: "Configuration",
        property: "EquipmentTypeId",
        options:
          sortBy(
            equipmentConfigurationSearchRequest.data?.map((x) => ({ value: x, label: getEquipmentLabel(x) })),
            "label",
          ) ?? [],
      },
      {
        icon: (hasFilters) => (
          <PolIcon name={"Blocks"} className="m-auto" stroke={hasFilters ? "var(--primary-400)" : "var(--text-700)"} />
        ),
        property: PunchListKey,
        label: "Punch List",
        options:
          sortBy(
            punchListItemRequest.data?.map((x) => ({ value: x.Title, label: x.Title })),
            "label",
          ) ?? [],
      },
    ],
    [
      locationSearchRequest.data,
      equipmentConfigurationSearchRequest.data,
      equipmentRequest.data,
      typeRequest.data,
      equipmentConfigurationRequest.data,
    ],
  );

  return (
    <>
      <Seo title="Equipment Units" />

      <EntityTableWithPagination
        searchText={searchText}
        onSearchTextChanged={setSearchText}
        request={equipmentUnitsRequest}
        onRowClicked={(x) =>
          navigate({
            to: "/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag",
            params: { projectDatabaseId, equipmentUnitId: x.id },
          })
        }
        isVirtualized={true}
        showSearch={true}
        dense={false}
        header={
          <EntityFilterOptionDisplay
            className="mt-2 w-full"
            options={filterOptions}
            selectedOptions={filters}
            setSelectedOptions={setFilters}
          />
        }
        addons={[
          <NewEquipmentUnit
            projectDatabaseId={projectDatabaseId}
            onCreated={() => equipmentUnitsRequest.refetch()}
          ></NewEquipmentUnit>,

          <EntityFilterPanel
            className="w-full lg:w-[250px]"
            options={filterOptions}
            selectedOptions={filters}
            setSelectedOptions={setFilters}
          />,
        ]}
        columns={[
          { idGetter: (unit) => toEquipmentUnitTitle(unit), label: "Unit Number", id: "UnitNumber" },
          { id: "Panel" },
          { id: "Location" },
          { id: "Purpose", idGetter: (unit) => getFullPurpose(unit) },
          { id: "Description" },
          {
            id: "PatternId",
            label: "Pattern",
            renderCell: (value) =>
              isNullOrWhitespace(value.PatternId) === false &&
              isNullOrWhitespace(value.Pattern2Id) === false && (
                <PolIcon name="stroke_full" source="google" hintText="Has pattern" />
              ),
          },
          { id: "MediaContentsCount", label: "Media Contents Count" },
        ]}
        orderByProperty="UnitNumber"
        mobileRowTemplate={(x, index, props) => (
          <>
            <div
              onClick={() =>
                navigate({
                  to: "/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag",
                  params: { projectDatabaseId, equipmentUnitId: x.id },
                })
              }
              tabIndex={-1}
              key={x.id}
              {...props}
              className="mobile-card-item grid grid-flow-col"
            >
              <div className="grid grid-flow-row">
                <span className="text-left font-medium">{toEquipmentUnitTitle(x)}</span>
                <span className="text-left text-xs">{getFullPurpose(x)}</span>
              </div>
              <div className="text-right">
                <span className="text-right font-medium">{`${x.Panel}`}</span>
                {x.MediaContentsCount > 0 && (
                  <PolIcon name="Image" size="1.5rem" className=" m-auto mr-0" isIconFilled={true} />
                )}
              </div>
            </div>
          </>
        )}
      />
    </>
  );
};

export default EquipmentUnitListView;
