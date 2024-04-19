import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useToast } from "@/components/ui/use-toast";

import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import { ControlType } from "@/sdk/entities/project/equipment/EquipmentControl";
import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { LightingFixtureConfiguration } from "@/sdk/entities/project/equipment/LightingFixtureConfiguration";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { Manufacturer } from "@/sdk/entities/project/equipment/Manufacturer";
import { Pattern } from "@/sdk/entities/project/equipment/Pattern";
import { RevitImport } from "@/sdk/entities/project/equipment/revit/RevitImport";
import { getUtcMoment } from "@/sdk/utils/dateUtils";
import { getFullPurpose } from "@/sdk/utils/entityUtils/equipmentUnitUtils";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import moment from "moment";
import * as XLSX from "xlsx";
import { AssignableUnitOptions } from "./RevitParameterOptions";
import { getValueByPath } from "@/utilities/objectPathUtilities";
import { useState } from "react";
import { useRevitInteractionViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/revit.lazy";

export default function ExportButton() {
  const equipments = useDbQuery(LightingFixture);
  const equipmentTypes = useDbQuery(LightingFixtureConfiguration);
  const equipmentCategories = useDbQuery(EquipmentType);
  const manufacturers = useDbQuery(Manufacturer);
  const patterns = useDbQuery(Pattern);
  const { toast } = useToast();
  const { projectDatabaseId } = useRevitInteractionViewParams();

  const projectDatabase = useDbQueryFirst(ProjectDatabase, `WHERE c.id = "${projectDatabaseId}"`);
  const equipmentUnits = useDbQuery(LightingFixtureUnit, `WHERE c.ProjectDatabaseId = "${projectDatabaseId}"`);
  const revitImportRequest = useDbQueryFirst(RevitImport, `WHERE c.ProjectDatabaseId = "${projectDatabaseId}"`);
  const getUnitNumber = (unit: LightingFixtureUnit) => {
    let unitNumber = `${unit.UnitNumber}`;
    if (unit.UnitNumberIndex) {
      unitNumber += `.${unit.UnitNumberIndex}`;
    }
    if (unit.UnitLetterIndex) {
      unitNumber += ` ${unit.UnitLetterIndex}`;
    }
    return unitNumber;
  };
  const getUnitType = (unit: LightingFixtureUnit) => {
    const type = equipmentTypes.data.find((type) => type.id === unit.EquipmentTypeId);
    const category = equipmentCategories.data.find((category) => category.id === type.EquipmentCategoryId);
    category.Code;
    type.Index;
    type.Index2;

    let response = category.Code;
    if (type.Index) {
      response += `${type.Index}`;
    }
    if (type.Index2) {
      response += `${type.Index2}`;
    }

    return response;
  };
  const getPattern = (unit: LightingFixtureUnit) => {
    if (isNullOrWhitespace(unit.PatternId)) {
      const type = equipmentTypes.data.find((type) => type.id === unit.EquipmentTypeId);
      const equipment = equipments.data.find((equipment) => equipment.id === type.EquipmentId);
      if (equipment.CanTakeGobo) {
        return "None";
      } else {
        return "-";
      }
    }

    const pattern = patterns.data.find((pattern) => pattern.id === unit.PatternId);
    const manufacturerCodeName = manufacturers.data.find(
      (manufacturer) => manufacturer.id === pattern.ManufacturerId,
    ).CodeName;

    let response = `${manufacturerCodeName}:${pattern.Model}:${unit.PatternSize}`;

    if (isNullOrWhitespace(unit.Pattern2Id) === false) {
      console.log(unit.Pattern2Id);
      const pattern2 = patterns.data.find((pattern) => pattern.id === unit.Pattern2Id);
      if (!pattern2) return response;
      const manufacturerCodeName2 = manufacturers.data.find(
        (manufacturer) => manufacturer.id === pattern2.ManufacturerId,
      ).CodeName;
      response += ` + ${manufacturerCodeName2}:${pattern2.Model}:${unit.Pattern2Size}`;
    }

    return response;
  };

  const generateArray = (units: LightingFixtureUnit[]) => {
    console.log(units);
    const assignedParameters = projectDatabase.data.AssignedParameters;
    const pushDate = moment.utc().local().format("MM/DD/YYYY hh:mm:ss");
    const array = [assignedParameters.map((x) => x.ExcelParameter)];
    const rows = equipmentUnits.data.map((unit) => {
      const array = [];
      assignedParameters.forEach((x) => {
        if (x.PropertyName == "UnitId") {
          array.push(getUnitNumber(unit));
        } else if (x.PropertyName == "EquipmentTypeId") {
          array.push(getUnitType(unit));
        } else if (x.PropertyName == "Purpose") {
          array.push(getFullPurpose(unit));
        } else if (x.PropertyName == "Control.Type") {
          array.push(ControlType[unit.Control.Type] === "Unknown" ? "" : ControlType[unit.Control.Type]);
        } else if (x.PropertyName == "Pattern") {
          array.push(getPattern(unit));
        } else if (x.PropertyName == "LastImported") {
          array.push(`Imported on: ${pushDate}`);
        } else {
          array.push(getValueByPath(unit, x.PropertyName));
        }
      });
      return array;
    });
    rows.sort((a, b) => {
      if (a[0] < b[0]) {
        return -1;
      }
      if (a[0] > b[0]) {
        return 1;
      }
      return 0;
    });
    array.push(...rows);
    return array;
  };

  const handleExport = () => {
    if (isUsable(revitImportRequest.data) === false) {
      toast({ title: "Error", description: "Import needs to occur first before being able to export." });
      return;
    }
    try {
      const wb = XLSX.utils.book_new();
      const data = XLSX.utils.aoa_to_sheet(generateArray(equipmentUnits.data));
      const metadata = XLSX.utils.aoa_to_sheet([[revitImportRequest.data.RevitProjectId]]);
      XLSX.utils.book_append_sheet(wb, data, "data");
      XLSX.utils.book_append_sheet(wb, metadata, "metadata");
      XLSX.writeFile(wb, `${projectDatabase.data?.Name} - ${getUtcMoment().local().format("MM-DD-YYYY")}.xlsx`);
    } catch (error) {
      toast({ title: "Error", description: error.message });
    }
  };

  return (
    <PolRequestPresenter
      containerClassName="ml-auto w-fit"
      request={[equipmentUnits, equipments, equipmentTypes, equipmentCategories, manufacturers, patterns]}
      onSuccess={() => (
        <>
          <PolButton onClick={handleExport}>Export</PolButton>
          {/* <ExcelUpdater></ExcelUpdater> */}
        </>
      )}
    ></PolRequestPresenter>
  );
}

const ExcelUpdater = () => {
  const [baseFile, setBaseFile] = useState<Blob>();
  const [updateFile, setUpdateFile] = useState<Blob>();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<Blob | undefined>>,
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const readExcelFile = (file: Blob): Promise<XLSX.WorkSheet> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        resolve(worksheet);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  const handleUpdateClick = async () => {
    if (!baseFile || !updateFile) {
      alert("Please select both files before updating.");
      return;
    }

    const baseWorksheet = await readExcelFile(baseFile);
    const updateWorksheet = await readExcelFile(updateFile);

    const baseData = XLSX.utils.sheet_to_json(baseWorksheet);
    const updateData = XLSX.utils.sheet_to_json(updateWorksheet);

    const updateMap = new Map(updateData.map((row: any) => [row["FIX-NUMBER"], row]));

    const updatedData = baseData.map((baseRow: any) => {
      const updateRow = updateMap.get(baseRow["FIX-NUMBER"]);
      if (updateRow) {
        return {
          ...baseRow,
          "FIX-CTRLADD": baseRow["FIX-CTRLADD"] || updateRow["FIX-CTRLADD"],
          "FIX-CTRLUNIV": baseRow["FIX-CTRLUNIV"] || updateRow["FIX-CTRLUNIV"],
        };
      }
      return baseRow;
    });

    const wb = XLSX.utils.book_new();
    const data = XLSX.utils.json_to_sheet(updatedData);
    XLSX.utils.book_append_sheet(wb, data, "data");
    XLSX.writeFile(wb, `Merged - ${getUtcMoment().local().format("MM-DD-YYYY")}.xlsx`);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleFileChange(e, setBaseFile)} />
      <input type="file" onChange={(e) => handleFileChange(e, setUpdateFile)} />
      <button onClick={handleUpdateClick}>Update Spreadsheet</button>
    </div>
  );
};
