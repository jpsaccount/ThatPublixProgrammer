import { useToast } from "@/components/ui/use-toast";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { useRevitInteractionViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/revit.lazy";
import { ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import { ControlType } from "@/sdk/entities/project/equipment/EquipmentControl";
import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";
import { LightingFixtureConfiguration } from "@/sdk/entities/project/equipment/LightingFixtureConfiguration";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { Manufacturer } from "@/sdk/entities/project/equipment/Manufacturer";
import { Pattern } from "@/sdk/entities/project/equipment/Pattern";
import { RevitChangeType } from "@/sdk/entities/project/equipment/revit/RevitChangeType";
import { RevitEquipmentUnitChange } from "@/sdk/entities/project/equipment/revit/RevitEquipmentUnitChange";
import { RevitImport } from "@/sdk/entities/project/equipment/revit/RevitImport";
import { ValueChangedEvent } from "@/sdk/models/UpdateRequest";
import { toEquipmentUnitTitle } from "@/sdk/utils/entityUtils/equipmentUnitUtils";
import { parseStringToEnum } from "@/sdk/utils/parseStringToEnum";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { chunkArray } from "@/utilities/arrayUtilities";
import { setValueByPath } from "@/utilities/objectPathUtilities";
import moment from "moment";
import { useEffect, useState } from "react";
import { read, utils } from "xlsx";

export function useRevitView() {
  const manufacturerRequest = useDbQuery(Manufacturer);
  const [isNewRevitImport, setIsNewRevitImport] = useState(false);
  const [changes, setChanges] = useState<RevitEquipmentUnitChange[] | null>(null);
  const [pendingEquipmentUnits, setPendingEquipmentUntis] = useState<LightingFixtureUnit[] | null>(null);
  const [revitImport, setRevitImport] = useState<RevitImport | null>(null);
  const { projectDatabaseId } = useRevitInteractionViewParams();
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const equipmentUnitRequest = useDbQuery(LightingFixtureUnit, `WHERE c.ProjectDatabaseId = "${projectDatabaseId}"`);
  const goboRequest = useDbQuery(Pattern);
  const equipmentCategoryRequest = useDbQuery(EquipmentType);

  const projectDatabase = useDbQueryFirst(ProjectDatabase, `WHERE c.id = "${projectDatabaseId}"`);

  const equipmentTypesRequest = useDbQuery(
    LightingFixtureConfiguration,
    `WHERE c.EquipmentTypeGroupId IN ["${projectDatabase.data?.EquipmentTypeGroups.join(`","`)}"]`,
  );

  const toast = useToast();

  useEffect(() => {
    if (
      equipmentUnitRequest.data &&
      manufacturerRequest.data &&
      goboRequest.data &&
      equipmentTypesRequest.data &&
      equipmentCategoryRequest.data
    )
      setIsReady(true);
    else {
      setIsReady(false);
    }
  }, [
    equipmentUnitRequest.data,
    manufacturerRequest.data,
    goboRequest.data,
    equipmentTypesRequest.data,
    equipmentCategoryRequest.data,
  ]);

  const upsertEquipment = useDbUpsert(LightingFixtureUnit);
  const deleteEquipment = useDbDelete(LightingFixtureUnit);
  const upsertRevitImport = useDbUpsert(RevitImport);
  const upsertRevitChanges = useDbUpsert(RevitEquipmentUnitChange);

  const parseUnitNumber = (unitNumberString: string): [number, number | null, string | null] => {
    const [unitNumber, rest] = unitNumberString.split(/[ .]+/);

    const unitNumberIndex = rest ? parseInt(rest, 10) : 0;

    const unitLetterIndex = rest ? rest.replace(/[0-9]/g, "") : "";

    return [parseInt(unitNumber, 10), unitNumberIndex, unitLetterIndex];
  };
  const parseUnitTypeId = (unitTypeRawString: string) => {
    let equipmentCategoryCode = "";
    let equipmentTypeIndex = "";
    let equipmentTypeIndex2 = "";

    for (let i = 0; i < unitTypeRawString.length; i++) {
      const currentCharacter = unitTypeRawString[i];

      if (currentCharacter === ":") {
        break;
      }

      if (/[a-zA-Z]/.test(currentCharacter)) {
        if (!equipmentTypeIndex) {
          equipmentCategoryCode += currentCharacter;
        } else {
          equipmentTypeIndex2 += currentCharacter;
        }
      } else if (/[0-9]/.test(currentCharacter)) {
        equipmentTypeIndex += currentCharacter;
      }
    }

    const equipmentCategoryId = equipmentCategoryRequest?.data?.find((x) => x.Code === equipmentCategoryCode)?.id;

    const equipmentTypeId = equipmentTypesRequest.data.find(
      (x) =>
        x.EquipmentCategoryId === equipmentCategoryId &&
        x.Index === equipmentTypeIndex &&
        x.Index2 === equipmentTypeIndex2,
    )?.id;
    if (isUsable(equipmentTypeId) == false) {
      console.log(equipmentCategoryCode, equipmentTypeIndex, equipmentTypeIndex2);
      throw new Error(
        `Equipment Type: ${equipmentCategoryCode} ${equipmentCategoryId} ${equipmentTypeIndex}${equipmentTypeIndex2} was not found`,
      );
    }
    return equipmentTypeId;
  };

  function deserializePattern(inputString: string): string[] {
    const value = inputString.split("+");
    let patternId = "";
    let patternSize = "";
    let patternNumber2 = "";
    let patternSize2 = "";

    if (value.length === 2) {
      const pattern1 = value[0].trim().split(":");
      const pattern2 = value[1].trim().split(":");

      //G:223:A
      if (pattern1.length === 3 && pattern2.length === 3) {
        const manfuacturerCodeName = pattern1[0];
        const patternModel = pattern1[1];

        const manfuacturerCodeName2 = pattern2[0];
        const patternModel2 = pattern2[1];
        const manufacturerId = manufacturerRequest.data.find((x) => x.CodeName === manfuacturerCodeName)?.id;

        if (isUsable(manufacturerId) === false) {
          setImportErrors((x) => [...x, `Manufacturer ${manfuacturerCodeName} not found`]);
          return;
        }

        const goboId = goboRequest.data.find(
          (x) => x.Model === patternModel && x.ManufacturerId === manufacturerId,
        )?.id;

        if (isUsable(goboId) === false) {
          setImportErrors((x) => [...x, `Gobo ${patternModel} not found  in ${manufacturerId}`]);
          return;
        }

        const manufacturerId2 = manufacturerRequest.data.find((x) => x.CodeName === manfuacturerCodeName2)?.id;

        if (isUsable(manufacturerId2) === false) {
          setImportErrors((x) => [...x, `Manufacturer ${manfuacturerCodeName2} not found`]);
          return;
        }
        const goboId2 = goboRequest.data.find(
          (x) => x.Model === patternModel2 && x.ManufacturerId === manufacturerId2,
        )?.id;

        if (isUsable(goboId2) === false) {
          setImportErrors((x) => [...x, `Manufacturer ${patternModel2} not found`]);
          return;
        }

        patternId = goboId ?? "";
        patternSize = pattern1[2] ?? "";
        patternNumber2 = goboId2 ?? "";
        patternSize2 = pattern2[2] ?? "";
        return [patternId, patternSize, patternNumber2, patternSize2];
      }
    } else {
      const pattern = value[0].trim().split(":");

      if (pattern.length === 3) {
        const manfuacturerCodeName = pattern[0];
        const patternModel = pattern[1];
        patternSize = pattern[2] ?? "";

        const manufacturerId = manufacturerRequest.data.find((x) => x.CodeName === manfuacturerCodeName)?.id;
        if (isUsable(manufacturerId) === false) {
          setImportErrors((x) => [...x, `Manufacturer ${manfuacturerCodeName} not found`]);
          return;
        }
        const goboId = goboRequest.data.find(
          (x) => x.Model === patternModel && x.ManufacturerId === manufacturerId,
        )?.id;

        if (isUsable(goboId) === false) {
          setImportErrors((x) => [...x, `Gobo ${patternModel} not found  in ${manufacturerId}`]);
          return;
        }
        patternId = goboId ?? "";
        patternSize = pattern[2] ?? "";

        return [patternId, patternSize];
      }
    }
    return [patternId, patternSize, patternNumber2, patternSize2];
  }

  let equipmentUnits: LightingFixtureUnit[] = [];
  const handleUpload = (files: FileList) => {
    const file = files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const excelData = (utils.sheet_to_json(sheet, { header: 1 }) as any[][]).map((row) =>
          row.map((cell) => cell.toString()),
        );

        function getColumnIndex(headerName: string) {
          return excelData[0].findIndex((cell) => cell === headerName);
        }

        equipmentUnits = excelData
          .slice(1)
          .map((row) => {
            try {
              const excelParameterMaps = projectDatabase.data.AssignedParameters;
              if (isUsable(excelParameterMaps) === false) {
                toast.toast({
                  title: "Error importing",
                  description: "Project database must have assigned parameters before importing...",
                });
                return;
              }

              const unitIdParameter = excelParameterMaps.find((x) => x.PropertyName == "UnitId").ExcelParameter;
              const unitIdParameterData: string = row[getColumnIndex(unitIdParameter)];
              if (isUsable(unitIdParameterData) === false) return;
              const [unitNumber, unitNumberIndex, unitLetterIndex] = parseUnitNumber(unitIdParameterData);
              if (Number.isNaN(unitNumber)) return;

              const found = equipmentUnitRequest.data.find(
                (x) =>
                  x.UnitNumber === unitNumber &&
                  x.UnitNumberIndex === unitNumberIndex &&
                  x.UnitLetterIndex === unitLetterIndex,
              );

              const equipmentUnit = found ? { ...found, Control: { ...found.Control } } : new LightingFixtureUnit();
              equipmentUnit.UnitNumber = unitNumber;
              equipmentUnit.UnitNumberIndex = unitNumberIndex;
              equipmentUnit.UnitLetterIndex = unitLetterIndex;
              excelParameterMaps.forEach((element) => {
                const elementPropertyName = element.PropertyName;
                const columnIndex = getColumnIndex(element.ExcelParameter);
                if (columnIndex === -1) return;

                const data = row[columnIndex];
                if (elementPropertyName == "UnitId") {
                } else if (elementPropertyName == "EquipmentTypeId") {
                  equipmentUnit.EquipmentTypeId = parseUnitTypeId(data);
                } else if (elementPropertyName == "Purpose") {
                  let [purpose, subPurpose] = data.split(/ \(/, 2);
                  subPurpose = subPurpose?.replace(/\)/, "") ?? "";
                  equipmentUnit.Purpose = purpose;
                  equipmentUnit.SubPurpose = subPurpose;
                } else if (elementPropertyName == "Control.Type") {
                  const newType = parseStringToEnum(ControlType, data);

                  if (isUsable(newType)) {
                    equipmentUnit.Control.Type = newType;
                  }
                } else if (elementPropertyName == "Pattern") {
                  const patternRawString = data;
                  if (patternRawString === "None" || patternRawString === "" || patternRawString === "-") {
                    equipmentUnit.Pattern2Id = "";
                    equipmentUnit.Pattern2Size = "";
                    equipmentUnit.PatternId = "";
                    equipmentUnit.PatternRawString = "";
                    equipmentUnit.PatternSize = "";
                  } else {
                    const pattern = deserializePattern(patternRawString);
                    if (isUsable(pattern)) {
                      const newPatternId = pattern[0];

                      const newPatternFound = isNullOrWhitespace(newPatternId) === false;
                      if (newPatternFound || isNullOrWhitespace(equipmentUnit.PatternId) === false) {
                        equipmentUnit.PatternId = newPatternId;
                      }

                      if (
                        isNullOrWhitespace(pattern[1]) === false ||
                        isNullOrWhitespace(equipmentUnit.PatternSize) === false
                      ) {
                        equipmentUnit.PatternSize = pattern[1];
                      }
                      if (pattern.length === 4) {
                        if (
                          isNullOrWhitespace(pattern[3]) === false ||
                          isNullOrWhitespace(equipmentUnit.Pattern2Id) === false
                        ) {
                          equipmentUnit.Pattern2Id = pattern[3];
                        }
                        if (
                          isNullOrWhitespace(pattern[4]) === false ||
                          isNullOrWhitespace(equipmentUnit.Pattern2Size) === false
                        ) {
                          equipmentUnit.Pattern2Size = pattern[4];
                        }
                      }
                    }
                  }
                  equipmentUnit.PatternRawString = patternRawString;
                } else if (elementPropertyName == "Address") {
                  equipmentUnit.Control.DMXAddress = data;
                } else if (elementPropertyName == "Universe") {
                  equipmentUnit.Control.DMXUniverse = data;
                } else {
                  setValueByPath(equipmentUnit, elementPropertyName, data);
                }
              });

              return equipmentUnit;
            } catch (error) {
              console.log(error.message);
              setImportErrors((x) => [...x, error.message]);
            }
          })
          .filter((x) => isUsable(x));
        const metadataSheet = workbook.Sheets["metadata"];
        const metadata = utils.sheet_to_json(metadataSheet, { header: 1 }) as string[][];

        const revitProjectId = metadata[0][0];

        handleSubmit(equipmentUnits, revitProjectId);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  function checkForTdbFixtures(equipmentUnits: LightingFixtureUnit[]): string | null {
    const tbdFixtures = equipmentUnits.filter((unit) => unit.ExternalID === "TBD");
    if (tbdFixtures.length > 0) {
      const tbdUnits = tbdFixtures.map((unit) => unit.UnitId).join("; ");
      return `TBD fixtures found: ${tbdUnits}`;
    }

    return null;
  }
  const warningFinders = [checkForTdbFixtures];
  const errorFinders = [checkForDuplicateFixtures];

  function checkForDuplicateFixtures(equipmentUnits: LightingFixtureUnit[]): string | null {
    const duplicates = equipmentUnits.filter((unit, index, self) => {
      return self.some(
        (u, uIndex) =>
          uIndex !== index &&
          u.UnitNumber === unit.UnitNumber &&
          u.UnitNumberIndex === unit.UnitNumberIndex &&
          u.UnitLetterIndex === unit.UnitLetterIndex,
      );
    });

    console.log(duplicates);
    console.log(equipmentUnits);

    if (duplicates.length > 0) {
      const duplicateUnits = Array.from(
        new Set(
          duplicates
            .sort((a, b) => (a.UnitId > b.UnitId ? 1 : 0))
            .map((unit) => unit.UnitNumber + "." + unit.UnitNumberIndex + unit.UnitLetterIndex),
        ),
      ).join(", ");
      return `Duplicate fixtures found: ${duplicateUnits}`;
    }

    return null;
  }

  function identifyModifiedProperties(
    original: LightingFixtureUnit,
    imported: LightingFixtureUnit,
  ): Array<ValueChangedEvent> {
    const modifiedProperties = new Array<ValueChangedEvent>();
    for (const key in original) {
      if (original.hasOwnProperty(key) && imported.hasOwnProperty(key)) {
        const originalValue = original[key];
        const newValue = imported[key];
        if (
          typeof originalValue === "object" &&
          moment.isMoment(originalValue) === false &&
          originalValue !== null &&
          newValue !== null
        ) {
          // recursion :P
          const results = identifyModifiedProperties(originalValue, newValue);
          if (results.length === 0) continue;

          modifiedProperties.push(...results);
        } else if (originalValue !== newValue) {
          const valueChanges = new ValueChangedEvent();
          valueChanges.PropertyName = key;
          valueChanges.PreviousValue = originalValue;
          valueChanges.NewValue = newValue;
          modifiedProperties.push(valueChanges);
        }
      }
    }
    return modifiedProperties;
  }

  const PropertiesToIgnore = ["ExternalVersionGuid"];

  function isEquipmentUnitEqual(original: LightingFixtureUnit, imported: LightingFixtureUnit): boolean {
    const isEqual =
      original.Control.DMXAddress === imported.Control.DMXAddress &&
      original.Control.DMXUniverse === imported.Control.DMXUniverse &&
      original.Control.IsUsingDmx === imported.Control.IsUsingDmx &&
      original.Control.Type === imported.Control.Type &&
      original.UnitNumber === imported.UnitNumber &&
      original.UnitLetterIndex === imported.UnitLetterIndex &&
      original.UnitNumberIndex === imported.UnitNumberIndex &&
      original.Description === imported.Description &&
      original.Purpose === imported.Purpose &&
      original.Filter === imported.Filter &&
      original.PatternSize === imported.PatternSize &&
      original.InternalNotes === imported.InternalNotes &&
      original.Notes === imported.Notes &&
      original.Circuit === imported.Circuit &&
      original.Panel === imported.Panel &&
      original.Location === imported.Location &&
      original.ExternalID === imported.ExternalID &&
      original.SetupNotes === imported.SetupNotes &&
      original.InstallNotes === imported.InstallNotes &&
      original.Pattern2Size === imported.Pattern2Size &&
      original.Channel === imported.Channel &&
      original.SubPurpose === imported.SubPurpose &&
      original.ExternalVersionGuid === imported.ExternalVersionGuid &&
      original.ProjectDatabaseId === imported.ProjectDatabaseId &&
      original.EquipmentTypeId === imported.EquipmentTypeId &&
      original.PatternId === imported.PatternId &&
      original.Pattern2Id === imported.Pattern2Id &&
      original.LCIO === imported.LCIO &&
      original.Accessories === imported.Accessories &&
      original.MediaContentsCount === imported.MediaContentsCount &&
      original.MediaContentStatus === imported.MediaContentStatus &&
      original.MediaContentStatusPriority === imported.MediaContentStatusPriority &&
      original.Settings === imported.Settings;

    return isEqual;
  }

  function identifyChanges(
    databaseUnits: LightingFixtureUnit[],
    importedUnits: LightingFixtureUnit[],
    revitImportId: string,
  ): RevitEquipmentUnitChange[] {
    const changes: RevitEquipmentUnitChange[] = [];

    const units = new Set<LightingFixtureUnit>();

    importedUnits.forEach((imported) => {
      const databaseUnit = databaseUnits.find(
        (o) =>
          o.id === imported.id ||
          (o.UnitNumber === imported.UnitNumber &&
            o.UnitNumberIndex === imported.UnitNumberIndex &&
            o.UnitLetterIndex === imported.UnitLetterIndex),
      );
      if (isUsable(databaseUnit) === false) {
        const revitCHange = new RevitEquipmentUnitChange();
        revitCHange.ChangeType = RevitChangeType.Added;
        revitCHange.RevitImportId = revitImportId;
        revitCHange.EquipmentUnitId = imported.id;
        revitCHange.EquipmentUnitTitle = toEquipmentUnitTitle(imported);
        changes.push(revitCHange);
      }
    });

    databaseUnits.forEach((original) => {
      const imported = importedUnits.find(
        (i) =>
          i.id === original.id ||
          (i.UnitNumber === original.UnitNumber &&
            i.UnitNumberIndex === original.UnitNumberIndex &&
            i.UnitLetterIndex === original.UnitLetterIndex),
      );

      if (isUsable(imported) === false || units.has(imported)) {
        const revitCHange = new RevitEquipmentUnitChange();
        revitCHange.EquipmentUnitId = original.id;
        revitCHange.ChangeType = RevitChangeType.Deleted;
        revitCHange.RevitImportId = revitImportId;
        revitCHange.EquipmentUnitTitle = toEquipmentUnitTitle(imported ?? original);

        changes.push(revitCHange);
      } else {
        units.add(imported);
      }
    });

    databaseUnits.forEach((original) => {
      const imported = importedUnits.find(
        (i) =>
          i.id === original.id ||
          (i.UnitNumber === original.UnitNumber &&
            i.UnitNumberIndex === original.UnitNumberIndex &&
            i.UnitLetterIndex === original.UnitLetterIndex),
      );

      if (imported && isEquipmentUnitEqual(original, imported) === false) {
        const revitCHange = new RevitEquipmentUnitChange();
        revitCHange.EquipmentUnitId = original.id;
        revitCHange.ChangeType = RevitChangeType.Modified;
        revitCHange.RevitImportId = revitImportId;
        revitCHange.EquipmentUnitTitle = toEquipmentUnitTitle(imported);
        revitCHange.PropertiesChanged = identifyModifiedProperties(original, imported);
        revitCHange.PropertiesChanged = revitCHange.PropertiesChanged.filter(
          (x) => PropertiesToIgnore.includes(x.PropertyName) === false,
        );
        if (revitCHange.PropertiesChanged.length > 0) changes.push(revitCHange);
      }
    });

    return changes;
  }
  function checkForWarnings(equipmentUnits: LightingFixtureUnit[]) {
    setImportWarnings((x) => [
      ...x,
      ...warningFinders.map((finder) => finder(equipmentUnits)).filter((x) => x !== null),
    ]);
    return;
  }
  function checkForErrors(equipmentUnits: LightingFixtureUnit[]) {
    setImportErrors((x) => [...x, ...errorFinders.map((finder) => finder(equipmentUnits)).filter((x) => x !== null)]);
  }

  const handleSubmit = (equipmentUnits: LightingFixtureUnit[], revitProjectId: string) => {
    checkForWarnings(equipmentUnits);
    checkForErrors(equipmentUnits);

    const revit = new RevitImport();
    revit.ProjectDatabaseId = projectDatabaseId;
    revit.RevitProjectId = revitProjectId;
    const changes = identifyChanges(equipmentUnitRequest.data, equipmentUnits, revit.id);
    revit.ChangesCount = changes.length;
    setRevitImport(revit);
    setChanges(changes);
    setPendingEquipmentUntis(equipmentUnits);
    setIsNewRevitImport(true);

    equipmentUnits.forEach((unit) => {
      unit.ProjectDatabaseId = projectDatabaseId;
    });
  };

  const commitChanges = async () => {
    if (isUsable(revitImport) == false) return;

    await upsertRevitImport.mutateAsync(revitImport);

    const chunks = chunkArray(changes, 50);
    for (const chunk of chunks) {
      const promises = chunk.map(async (element) => {
        const equipmentUnit = pendingEquipmentUnits.find((x) => x.id === element.EquipmentUnitId);
        if (isUsable(equipmentUnit) == false && element.ChangeType != RevitChangeType.Deleted) {
          return;
        }
        if (element.ChangeType === RevitChangeType.Deleted) {
          const original = equipmentUnitRequest.data.find((x) => x.id == element.EquipmentUnitId);
          if (isUsable(original) === false) {
            return;
          }
          await deleteEquipment.mutateAsync(original);
        } else {
          await upsertEquipment.mutateAsync(equipmentUnit);
        }
        await upsertRevitChanges.mutateAsync(element);
      });
      try {
        await Promise.all(promises);
      } catch (error) {}
    }
  };

  const totalUnits = equipmentUnitRequest.data ? equipmentUnitRequest.data.length : 0;

  const unitsInRevit = equipmentUnitRequest.data
    ? equipmentUnitRequest.data.filter((unit) => isNullOrWhitespace(unit.ExternalID)).length
    : 0;
  return {
    importErrors: [...new Set<string>(importErrors)],
    importWarnings,
    handleUpload,
    isNewRevitImport,
    revitImport,
    changes,
    commitChanges,
    equipmentUnitRequest,
    totalUnits,
    unitsInRevit,
    isReady,
  };
}
