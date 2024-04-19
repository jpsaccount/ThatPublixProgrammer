import PolIcon from "@/components/PolIcon";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import { Seo } from "@/components/polComponents/Seo";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { Manufacturer } from "@/sdk/entities/project/equipment/Manufacturer";
import * as React from "react";
import { useMemo } from "react";

const EquipmentListView = () => {
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate("WHERE c.Nickname Contains '{0}'", "");
  const equipmentRequest = usePartialDbQuery(LightingFixture, query, 50);
  const upsertEquipment = useDbUpsert(LightingFixture);
  const manufacturerRequest = useDbQuery(Manufacturer);
  const navigate = usePolNavigate();
  const scrollContainerRef = React.useRef(null);

  const handleClick = (id: string) => {
    navigate({ to: "/equipment/$equipmentId", params: { equipmentId: id } });
  };
  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const scrollPosition = parseInt(searchParams.get("scrollY"), 10);

    if (!isNaN(scrollPosition) && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPosition;
    }
  }, []);

  const manufacturers = useMemo(
    () => new Map(manufacturerRequest.data?.map((c) => [c.id, c])),
    [manufacturerRequest.data],
  );

  async function createEquipment() {
    let equipment = new LightingFixture();
    equipment = await upsertEquipment.mutateAsync(equipment);
    navigate({ to: "/equipment/$equipmentId", params: { equipmentId: equipment.id } });
  }

  return (
    <>
      <Seo title="Equipment" />

      <EntityTableWithPagination
        searchText={searchText}
        onSearchTextChanged={setSearchText}
        request={equipmentRequest}
        onRowClicked={(x) => handleClick(x.id)}
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
            idGetter: (x) => manufacturers.get(x.ManufacturerId)?.Name ?? "unknown",
            renderCell: (x) => (
              <PolRequestPresenter
                request={manufacturerRequest}
                onSuccess={() => manufacturers.get(x.ManufacturerId)?.Name ?? "unknown"}
                onLoading={() => <PolSkeleton className="h-4 w-48" />}
              />
            ),
            id: "ManufacturerId",
            label: "Manufacturer",
          },
          { id: "Nickname" },
          { id: "Datasheets", label: "Datasheet Count", idGetter: (x) => x.Datasheets.length },
        ]}
        orderByProperty="Nickname"
      />
    </>
  );
};

export default EquipmentListView;
