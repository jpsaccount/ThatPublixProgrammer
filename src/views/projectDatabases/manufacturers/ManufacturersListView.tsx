import PolIcon from "@/components/PolIcon";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import { PolButton } from "@/components/polComponents/PolButton";
import { Seo } from "@/components/polComponents/Seo";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { Manufacturer } from "@/sdk/entities/project/equipment/Manufacturer";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import React, { useState } from "react";
import ManufacturerDetailView from "./ManufacturerDetailView";

export default function ManufacturersListView() {
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(
    "WHERE c.Name Contains '{0}' OR c.CodeName CONTAINS '{0}' ORDER BY c.Name DESC",
    "ORDER BY c.Name DESC",
  );
  const manufacturerRequest = usePartialDbQuery(Manufacturer, query, 50);
  const navigate = usePolNavigate();
  const upsertManufacturer = useDbUpsert(Manufacturer);

  const scrollContainerRef = React.useRef(null);

  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer>(null);

  const handleClick = (manufacturer: Manufacturer) => {
    setSelectedManufacturer(manufacturer);
  };

  const handleClose = (manufacturer: Manufacturer) => {
    setSelectedManufacturer(manufacturer);
    manufacturerRequest.refetch();
  };

  async function createEquipment() {
    let equipment = new Manufacturer();
    equipment = await upsertManufacturer.mutateAsync(equipment);
    manufacturerRequest.refetch();
    navigate({ to: equipment.id });
  }

  return (
    <>
      <Seo title="Manufacturers" />
      <EntityTableWithPagination
        searchText={searchText}
        onSearchTextChanged={setSearchText}
        request={manufacturerRequest}
        onRowClicked={handleClick}
        showSearch={true}
        isVirtualized={true}
        dense={false}
        addons={[
          <PolButton onClick={createEquipment} variant="ghost" className="ml-auto mr-0 md:ml-2">
            <PolIcon name="Plus" />
          </PolButton>,
        ]}
        columns={[
          {
            label: "Name",
            idGetter: (data) => {
              if (isNullOrWhitespace(data.CodeName)) return data.Name;
              return data.Name + ` (${data.CodeName})`;
            },
          },
        ]}
        orderByProperty="Name"
      />
      <ManufacturerDetailView
        selectedManufacturer={selectedManufacturer}
        onSelectedManufacturerChange={handleClose}
      ></ManufacturerDetailView>
    </>
  );
}
