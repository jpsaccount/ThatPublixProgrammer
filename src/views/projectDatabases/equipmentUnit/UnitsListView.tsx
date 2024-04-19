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
import { useUnitsListViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/equipment-units/units.lazy";
import PolInput from "@/components/polComponents/PolInput";
import { Search } from "lucide-react";
import ReactDataGrid from "@inovua/reactdatagrid-enterprise";

import "@inovua/reactdatagrid-enterprise/base.css";
import "../../../dataGridTheme.scss";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { s } from "vitest/dist/reporters-1evA5lom.js";
import ColumnSelect from "./ColumnSelect";
const UnitsListView = () => {
  const columns = useMemo(() => {
    return [
      { name: "UnitNumber", header: "Unit Number", render: ({ data }) => <span>{toEquipmentUnitTitle(data)}</span> },
      { name: "Description", header: "Description" },
      { name: "Panel", header: "Panel" },
      { name: "Circuit", header: "Circuit" },
      { name: "Purpose", header: "Purpose" },
      { name: "SubPurpose", header: "Sub Purpose" },
      { name: "Location", header: "Location" },
      {
        name: "EquipmentTypeId",
        header: "Equipment Type",
        render: ({ data: value }) => {
          return (
            <span>
              {(typeRequest.data?.find((i) => i.id === value.EquipmentCategoryId)?.Code ?? "...") +
                value.Index +
                value.Index2 +
                ": " +
                (equipmentRequest.data?.find((i) => i.id === value.EquipmentId)?.Nickname ?? "...")}
            </span>
          );
        },
      },
      { name: "Settings", header: "Settings" },
      { name: "ControlType", header: "Control Type" },
      { name: "Universe", header: "Universe" },
      { name: "Address", header: "Address" },
      { name: "LCIO", header: "LCIO" },
      { name: "Channel", header: "Channel" },
      { name: "Filter", header: "Filter" },
      {
        name: "PatternId",
        header: "Pattern",
        render: ({ data }) =>
          isNullOrWhitespace(data.PatternId) === false &&
          isNullOrWhitespace(data.Pattern2Id) === false && (
            <PolIcon name="stroke_full" source="google" hintText="Has pattern" />
          ),
      },
      { name: "Accessories", header: "Accessories" },
      { name: "Description", header: "Description" },
      { name: "FocusNotes", header: "Focus Notes" },
      { name: "InstallationNotes", header: "Installation Notes" },
      { name: "InternalNotes", header: "Internal Notes" },
    ];
  }, []);
  const { projectDatabaseId } = useUnitsListViewParams();
  const [availableColumns, setAvailableColumns] = useState(columns);
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
  const equipmentUnitsRequest = useDbQuery(LightingFixtureUnit, filteredQuery);

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
        label: "Scene",
        property: "Location",
        options: locationSearchRequest.data?.map((x) => ({ value: x, label: x })) ?? [],
      },
      {
        label: "Configuration",
        property: "EquipmentTypeId",
        options:
          sortBy(
            equipmentConfigurationSearchRequest.data?.map((x) => ({ value: x, label: getEquipmentLabel(x) })),
            "label",
          ) ?? [],
      },
      {
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
      <div className="space-y-1 p-1 md:flex md:space-y-0">
        <PolInput
          onValueChanged={setSearchText}
          value={searchText}
          placeholder="Search"
          className=" pl-6"
          overlayElement={<Search stroke="gray" size={15} className="my-auto ml-2"></Search>}
        ></PolInput>
        <EntityFilterOptionDisplay
          className="mt-2 w-full"
          options={filterOptions}
          selectedOptions={filters}
          setSelectedOptions={setFilters}
        />
        <EntityFilterPanel
          className="w-full lg:w-[250px]"
          options={filterOptions}
          selectedOptions={filters}
          setSelectedOptions={setFilters}
        />
        <ColumnSelect
          columns={columns}
          availableColumns={availableColumns}
          onChange={(x) => {
            console.log(x);
            setAvailableColumns(x);
          }}
        ></ColumnSelect>
      </div>
      <PolRequestPresenter
        request={equipmentUnitsRequest}
        onSuccess={() => (
          <ReactDataGrid
            theme="pol-blue"
            style={{ minHeight: 900 }}
            emptyText={"No fixtures found."}
            columns={availableColumns}
            dataSource={equipmentUnitsRequest.data}
          ></ReactDataGrid>
        )}
      ></PolRequestPresenter>
    </>
  );
};

export default UnitsListView;
