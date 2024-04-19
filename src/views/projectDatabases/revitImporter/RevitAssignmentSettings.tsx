import PolIcon from "@/components/PolIcon";
import PolAttachmentUploader from "@/components/polComponents/PolAttachmentUploader";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolDropdown } from "@/components/polComponents/PolDropdown";
import PolHeading from "@/components/polComponents/PolHeading";
import PolModal from "@/components/polComponents/PolModal";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { ExcelParameterMap, ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import { AssignableUnitOptions } from "./RevitParameterOptions";
import { useProjectDatabaseViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/index.lazy";

interface Props {
  isAssigned: boolean;
}

export default function RevitAssignmentSettings({ isAssigned }: Props) {
  const { projectDatabaseId } = useProjectDatabaseViewParams();
  const saveProjectDatabase = useDbUpsert(ProjectDatabase);
  const projectDatabaseRequest = useDbQueryFirst(ProjectDatabase, `WHERE c.id = "${projectDatabaseId}"`);

  const [isShowingModal, setIsShowingModal] = useState(false);
  const [assignments, setAssignments] = useState(projectDatabaseRequest.data.AssignedParameters ?? []);

  const [parameters, setParameters] = useState(new Array<string>());
  const [availableProperties, setAvailableProperties] = useState(AssignableUnitOptions);

  useEffect(() => {
    setAssignments(projectDatabaseRequest.data.AssignedParameters ?? []);
  }, [projectDatabaseRequest.data, isShowingModal]);

  useEffect(() => {
    const assignedParameters = assignments.map((x) => x.PropertyName);
    if (assignedParameters.length === 0) {
      setAvailableProperties(AssignableUnitOptions);
    } else {
      setAvailableProperties(
        AssignableUnitOptions.filter((x) => assignedParameters.includes(x.value.toString()) == false),
      );
    }
  }, [parameters, assignments]);

  const saveProjectDatabaseAssignedParameters = async () => {
    await saveProjectDatabase.mutateAsync({ ...projectDatabaseRequest.data, AssignedParameters: assignments });
    setIsShowingModal(false);
  };

  const handleUpload = (fileList: FileList) => {
    const file = fileList[0];

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
        const names = excelData[0].map((cell) => cell);
        setParameters(names);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  return (
    <PolModal
      isOpen={isShowingModal}
      onOpenChanged={(value) => setIsShowingModal(value)}
      heading={<div className="text-center">Assign Revit Properties</div>}
      modalTrigger={
        <PolIcon
          name="Settings"
          className="my-auto ml-auto w-auto cursor-pointer"
          stroke={isAssigned ? undefined : "rgb(240 82 82)"}
        ></PolIcon>
      }
    >
      <div className="max-h-screen min-w-[50dvw] overflow-y-auto p-5">
        <PolRequestPresenter
          request={projectDatabaseRequest}
          onSuccess={() => {
            return (
              <>
                <div style={{ display: parameters.length !== 0 && "none" }} className="m-auto">
                  <PolAttachmentUploader className="m-auto" onUpload={handleUpload}>
                    <PolButton className="mb-2">Upload an excel file</PolButton>
                  </PolAttachmentUploader>
                </div>
                <div className="grid ">
                  <div className="grid grid-flow-row border p-5">
                    <div className="stackGrid">
                      <div className="mr-auto grid grid-flow-col">
                        <PolButton
                          variant="ghost"
                          tooltip="Copy"
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(assignments))}
                        >
                          <PolIcon name="Copy" />
                        </PolButton>
                        <PolButton
                          variant="ghost"
                          tooltip="Paste"
                          onClick={async () => setAssignments(JSON.parse(await navigator.clipboard.readText()))}
                        >
                          <PolIcon name="ClipboardCopy" />
                        </PolButton>
                        <PolButton variant="ghost" tooltip="Clear" onClick={async () => setAssignments([])}>
                          <PolIcon name="Eraser" />
                        </PolButton>
                      </div>
                      <PolHeading size={4} className="mb-5 text-center">
                        Assigned
                      </PolHeading>
                    </div>
                    <div className="grid max-h-[65dvh] overflow-auto">
                      {assignments.map((parameter, index) => {
                        return (
                          <div
                            className=" grid grid-flow-col grid-cols-[1fr_auto_1fr_auto] items-center gap-2"
                            key={`${parameter.ExcelParameter}`}
                          >
                            <p>{parameter.ExcelParameter}</p>
                            <div className="">
                              <PolIcon name="ArrowRight"></PolIcon>
                            </div>
                            <p>
                              {AssignableUnitOptions.find((x) => x.value == parameter.PropertyName)?.label ?? "Unknown"}
                            </p>
                            <PolButton
                              variant="ghost"
                              onClick={() => setAssignments((x) => [...x.filter((x) => x.Id !== parameter.Id)])}
                            >
                              Delete
                            </PolButton>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {parameters.map((parameter, index) => {
                    return (
                      <div
                        className=" grid grid-flow-col grid-cols-[1fr_auto_1fr] items-center gap-2"
                        key={`${parameter}`}
                      >
                        <p>{parameter}</p>
                        <div className="">
                          <PolIcon name="ArrowRight"></PolIcon>
                        </div>
                        <PolDropdown
                          className="w-80"
                          placeHolder="Select"
                          nameGetter={(x) => x.label}
                          options={availableProperties}
                          value={AssignableUnitOptions.find(
                            (x) =>
                              x.value.toString() ===
                              assignments.find((i) => i.ExcelParameter === parameter)?.PropertyName,
                          )}
                          onValueChanged={(value) => {
                            setAssignments((x) => {
                              const excelMap = new ExcelParameterMap();
                              excelMap.ExcelParameter = parameter;
                              excelMap.PropertyName = value.value.toString();

                              return [...x, excelMap];
                            });
                          }}
                        ></PolDropdown>
                      </div>
                    );
                  })}
                </div>
                <PolButton onClick={saveProjectDatabaseAssignedParameters} className="mt-2 w-full">
                  Save
                </PolButton>
              </>
            );
          }}
        ></PolRequestPresenter>
      </div>
    </PolModal>
  );
}
