import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import RevitImportChangesAccordian from "./RevitImportChangesAccordian";

import PolAttachmentUploader from "@/components/polComponents/PolAttachmentUploader";
import { Skeleton } from "@/components/ui/skeleton";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { RevitChangeType } from "@/sdk/entities/project/equipment/revit/RevitChangeType";
import { RevitEquipmentUnitChange } from "@/sdk/entities/project/equipment/revit/RevitEquipmentUnitChange";
import { RevitImport } from "@/sdk/entities/project/equipment/revit/RevitImport";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useCallback, useEffect, useState } from "react";
import ExportButton from "./ExportButton";
import { useRevitView } from "./useRevitView";
import { useRevitInteractionViewParams as useRevitInteractionViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/revit.lazy";

const RevitIneractionView = () => {
  const {
    handleUpload,
    isNewRevitImport,
    revitImport,
    changes,
    commitChanges,
    equipmentUnitRequest,
    totalUnits,
    unitsInRevit,
    isReady,
    importErrors,
    importWarnings,
  } = useRevitView();

  const { projectDatabaseId } = useRevitInteractionViewParams();

  const [currentImportIndex, setCurrentImportIndex] = useState<number | null>(null);

  const [currentImport, setCurrentImport] = useState<RevitImport | undefined>(undefined);

  const projectDatabaseRequest = useDbQueryFirst(ProjectDatabase, `WHERE c.id = "${projectDatabaseId}"`);
  const previousRevitImports = useDbQuery(
    RevitImport,
    `WHERE c.ProjectDatabaseId = "${projectDatabaseId}" ORDER BY c.CreatedDateTime DESC`,
  );

  const currentImportChanges = useDbQuery(RevitEquipmentUnitChange, `WHERE c.RevitImportId = "${currentImport?.id}"`, {
    enabled: isUsable(currentImport),
  });

  const equipmentUnitsFromImportChanges = useDbQuery(
    LightingFixtureUnit,
    `WHERE c.id IN ["${currentImportChanges.data?.map((x) => x.EquipmentUnitId).join('","')}"]`,
    { enabled: isUsable(currentImportChanges.data) },
  );

  const onPreviousClick = useCallback(() => {
    setCurrentImportIndex((x) => {
      if (isUsable(x) == false) return 0;
      if (isUsable(previousRevitImports.data) === false) return 0;
      if (x + 1 < previousRevitImports.data.length) return x + 1;
      return null;
    });
  }, [previousRevitImports.data]);
  const onNextClick = useCallback(() => {
    setCurrentImportIndex((x) => (x ? (x === 0 ? null : x - 1) : null));
  }, []);

  useEffect(() => {
    if (previousRevitImports.data === undefined) return;
    setCurrentImport(previousRevitImports.data[currentImportIndex] ?? null);
  }, [currentImportIndex, previousRevitImports.data]);

  const readyToUpload = isReady && isUsable(currentImport) === false;
  const lastImport = previousRevitImports.data?.[0];
  const lastImportedOn = lastImport?.CreatedDateTime.local();
  return (
    <PolRequestPresenter
      ready={isReady}
      request={[equipmentUnitRequest, projectDatabaseRequest]}
      onSuccess={() => (
        <div className="m-auto grid min-w-[50%] grid-flow-row px-5">
          <div className="mt-2 grid grid-flow-col">
            <PolAttachmentUploader allowClick={readyToUpload} onUpload={handleUpload} className="w-fit">
              <PolButton disabled={readyToUpload == false}>Import</PolButton>
            </PolAttachmentUploader>
            <PolHeading className="mb-5 text-center">{projectDatabaseRequest.data.Name}</PolHeading>
            <ExportButton></ExportButton>
          </div>
          {isUsable(lastImportedOn) && (
            <div className="sticky top-[48px] grid grid-flow-col grid-cols-[1fr_200px_1fr] gap-5 rounded border p-2 backdrop-blur">
              <PolButton className="ml-auto w-24" variant="secondary" onClick={onPreviousClick}>
                Previous
              </PolButton>
              <PolText type="large" className="my-auto text-center">
                {currentImport ? currentImport.CreatedDateTime.local().format("YYYY-MM-DD hh:mm A") : "Current"}
              </PolText>
              <PolButton className="mr-auto w-24" variant="secondary" onClick={onNextClick}>
                Next
              </PolButton>
            </div>
          )}

          {isNewRevitImport && importErrors.length === 0 && changes.length > 0 && (
            <PolButton className="mx-auto" onClick={commitChanges}>
              Commit Changes
            </PolButton>
          )}

          {currentImport && (
            <PolRequestPresenter
              request={currentImportChanges}
              onSuccess={() => (
                <div className="mt-5 grid grid-flow-row">
                  <PolHeading size={3}>Changes:</PolHeading>
                  <div className="mt-5 grid grid-flow-row">
                    {currentImportChanges.data?.map((change) => (
                      <>
                        <div className="mt-2 flex flex-col rounded bg-secondary-50 p-2 dark:bg-gray-800">
                          <div className="flex flex-row">
                            <PolRequestPresenter
                              request={equipmentUnitsFromImportChanges}
                              onLoading={() => <Skeleton className="w-24" />}
                              onSuccess={() => {
                                let title = equipmentUnitsFromImportChanges.data?.find(
                                  (x) => x.id === change.EquipmentUnitId,
                                )?.UnitId;
                                if (isNullOrWhitespace(title)) {
                                  title = change.EquipmentUnitTitle;
                                }
                                console.log(title);
                                return <>{title}</>;
                              }}
                            ></PolRequestPresenter>{" "}
                            - {RevitChangeType[change.ChangeType]}
                          </div>
                          {change.PropertiesChanged.map((property) => (
                            <div className="text-gray-500 dark:text-gray-400">
                              {property.PropertyName} from "{property.PreviousValue}" to "{property.NewValue}"
                            </div>
                          ))}
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              )}
            ></PolRequestPresenter>
          )}

          {importErrors.length > 0 && (
            <div className="grid grid-flow-row">
              <PolHeading size={3}>Import Errors:</PolHeading>
              <PolText type="muted">
                {importErrors.length} errors were found during the import. Errors must be handled before imports can be
                committed
              </PolText>
              <div className="mt-5 grid grid-flow-row">
                {importErrors.map((error) => (
                  <PolText type="large">{error}</PolText>
                ))}
              </div>
            </div>
          )}
          {importErrors.length === 0 && changes && revitImport && (
            <RevitImportChangesAccordian revitImport={revitImport} changes={changes}></RevitImportChangesAccordian>
          )}
        </div>
      )}
    ></PolRequestPresenter>
  );
};

export default RevitIneractionView;
