import PolIcon from "@/components/PolIcon";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import { Seo } from "@/components/polComponents/Seo";
import { useToast } from "@/components/ui/use-toast";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import { cn } from "@/lib/utils";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { toEquipmentUnitTitle } from "@/sdk/utils/entityUtils/equipmentUnitUtils";
import { useEffect, useState } from "react";
import "./EquipmentUnitQrPrintView.css";
import PrintUnits from "./PrintUnits";
import SelectRangeOfUnits from "./SelectRangeOfUnits";
import { useEquipmentUnitQrPrintViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/equipment-units/qr-codes.lazy";

const PDFLIMIT = 2000;
const EquipmentUnitQrPrintView = () => {
  const { projectDatabaseId } = useEquipmentUnitQrPrintViewParams();
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(
    `WHERE c.ProjectDatabaseId = "${projectDatabaseId}" AND (c.UnitId Contains "{0}" OR c.Panel Contains "{0}") ORDER BY c.UnitNumber asc, c.UnitNumberIndex asc, c.UnitLetterIndex asc`,
    `WHERE c.ProjectDatabaseId = "${projectDatabaseId}" ORDER BY c.UnitNumber asc, c.UnitNumberIndex asc, c.UnitLetterIndex asc`,
  );
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedUnits.length > PDFLIMIT) {
      setSelectedUnits((x) => [...x.slice(0, PDFLIMIT)]);
      toast({ title: "Warning", description: `You can only select up to ${PDFLIMIT} units to print at a time.` });
    }
  }, [selectedUnits]);
  const equipmentUnitsRequest = usePartialDbQuery(LightingFixtureUnit, query, 50);
  const handleSelect = (x: LightingFixtureUnit) => {
    setSelectedUnits((prev) => {
      if (prev.includes(x.id)) {
        return prev.filter((y) => y !== x.id);
      } else {
        return [...prev, x.id];
      }
    });
  };

  const handleRange = (x: string[]) => {
    setSelectedUnits((prev) => [...new Set([...prev, ...x])]);
  };

  return (
    <>
      <Seo title="Equipment Units" />

      <EntityTableWithPagination
        rowClassName={(x) => selectedUnits.includes(x.id) && "selected"}
        searchText={searchText}
        onSearchTextChanged={setSearchText}
        request={equipmentUnitsRequest}
        onRowClicked={handleSelect}
        isVirtualized={true}
        showSearch={true}
        dense={false}
        addons={[
          <div className="mx-2 grid grid-flow-col gap-2">
            <SelectRangeOfUnits onSelect={handleRange}></SelectRangeOfUnits>
            <PrintUnits units={selectedUnits}></PrintUnits>
          </div>,
        ]}
        columns={[
          { idGetter: (unit) => toEquipmentUnitTitle(unit), label: "Unit Number", id: "UnitNumber" },
          { id: "Panel" },
          { id: "Location" },
          { id: "Description" },
          { id: "MediaContentsCount" },
        ]}
        orderByProperty="UnitNumber"
        mobileRowTemplate={(x, index, props) => (
          <>
            <div
              onClick={() => handleSelect(x)}
              id={x.id}
              tabIndex={-1}
              key={x.id}
              {...props}
              className={cn("mobile-card-item grid grid-flow-col", selectedUnits.includes(x.id) && "selected")}
            >
              <div className="grid grid-flow-row">
                <span className="text-left font-medium">{toEquipmentUnitTitle(x)}</span>
                <span className="text-left text-xs">
                  {x.Purpose} {x.SubPurpose}
                </span>
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

export default EquipmentUnitQrPrintView;
