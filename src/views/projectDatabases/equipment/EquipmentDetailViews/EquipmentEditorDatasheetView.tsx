import { EntityAttachmentViewer } from "@/components/EntityAttachmentViewer";
import PolIcon from "@/components/PolIcon";
import PolAttachmentUploader from "@/components/polComponents/PolAttachmentUploader";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import PolMutationErrorPresenter from "@/components/polComponents/PolMutationErrorPresenter";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { useAlert } from "@/contexts/AlertContext";
import { useDbAttachmentUpload } from "@/customHooks/sdkHooks/useDbAttachmentUpload";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { Datasheet } from "@/sdk/entities/project/equipment/Datasheet";
import { DatasheetEntry } from "@/sdk/entities/project/equipment/DatasheetEntry";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";
import { ContentQuality } from "../../../../sdk/contracts/Entity";
import { EquipmentEditorViewsProps } from "../EquipmentEditorView";

const EquipmentEditorDatasheetView = ({ equipment, onChange, update }: EquipmentEditorViewsProps) => {
  const [currentDatasheetIndex, setCurrentDatasheetIndex] = useState(0);
  const [currentDatasheetEntry, setCurrentDatasheetEntry] = useState<DatasheetEntry | null>(
    equipment.Datasheets?.length > 0 ? equipment.Datasheets[0] : null,
  );

  useEffect(() => {
    if (equipment.Datasheets.length <= currentDatasheetIndex) {
      setCurrentDatasheetIndex(0);
    }
    if (currentDatasheetIndex < 0) {
      setCurrentDatasheetIndex(equipment.Datasheets.length - 1);
    }

    setCurrentDatasheetEntry(equipment.Datasheets[currentDatasheetIndex] ?? equipment.Datasheets[0]);
  }, [currentDatasheetIndex, equipment.Datasheets]);
  const datasheetRequest = useDbQueryFirst(Datasheet, `WHERE c.id = "${currentDatasheetEntry?.DatasheetId}"`, {
    enabled: currentDatasheetEntry?.DatasheetId != null,
  });

  const { showAlert } = useAlert();
  const deleteDatasheetMutation = useDbDelete(Datasheet);
  const upsertDatasheet = useDbUpsert(Datasheet);
  const uploadDatasheet = useDbAttachmentUpload(Datasheet);

  const [IsUploading, setIsUploading] = useState(false);

  async function onImageUpload(files: FileList) {
    console.log("uploading..");
    setIsUploading(true);

    const filesArray = Array.from(files);

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      const datasheet = new Datasheet();
      datasheet.Title = file.name;
      const newDatasheet = await upsertDatasheet.mutateAsync(datasheet);
      await uploadDatasheet.mutateAsync([newDatasheet, file]);

      const datasheetEntry = new DatasheetEntry();
      datasheetEntry.DatasheetId = newDatasheet.id;
      update((x) => ({ ...x, Datasheets: [...x.Datasheets, datasheetEntry] }));
    }
    setIsUploading(false);
  }

  async function deleteDatasheet() {
    if (isUsable(datasheetRequest.data) === false) return;
    const confirmDelete = await showAlert({
      title: "Confirmation",
      description: "Are you sure you want to delete this datasheet?",
    });
    if (confirmDelete === false) return;
    const deleteDatasheetObject = await showAlert({
      title: "Confirmation",
      description: "Do you want to remove this datasheet from all fixtures?",
      confirmTitle: "Yes",
      cancelTitle: "No",
    });

    update((e) => ({
      ...e,
      Datasheets: e.Datasheets.filter((x) => x.DatasheetId !== currentDatasheetEntry.DatasheetId),
    }));
    if (deleteDatasheetObject) {
      await deleteDatasheetMutation.mutateAsync(datasheetRequest.data);
    }
  }

  const originalDownloadLink = datasheetRequest.data?.AttachmentMetadata.AttachmentLinks.find(
    (x) => x.ContentQuality === ContentQuality.Original,
  );

  return (
    <div className="grid grid-flow-row space-y-2 p-2 md:p-5">
      <PolHeading size={2} className="text-center">
        Datasheets
      </PolHeading>
      <div className="grid h-[50dvh]">
        <PolRequestPresenter
          request={datasheetRequest}
          ready={IsUploading === false}
          onFailure={() =>
            equipment.Datasheets.length === 0 ? (
              <div className="grid w-full">
                <PolText className="m-auto rounded bg-secondary-100 px-10 py-5">
                  <div className="flex flex-row gap-4">
                    <PolIcon name="AlertCircle" />
                    <PolText>No datasheets</PolText>
                  </div>
                </PolText>
              </div>
            ) : (
              <div></div>
            )
          }
          onSuccess={() => (
            <EntityAttachmentViewer
              viewerClassName="w-full h-[50dvh]"
              className="mx-auto"
              quality={ContentQuality.Compressed}
              entity={datasheetRequest.data}
            ></EntityAttachmentViewer>
          )}
        ></PolRequestPresenter>
      </div>

      <PolMutationErrorPresenter mutation={[upsertDatasheet, uploadDatasheet]} />
      <div className="mx-auto flex w-fit gap-5">
        {originalDownloadLink && (
          <a href={originalDownloadLink.Url}>
            <PolButton>
              <PolIcon name="Download" stroke="white" />
            </PolButton>
          </a>
        )}
        <Dropdown
          className="z-[10000]"
          arrowIcon={false}
          inline
          placement="top"
          label={
            <PolButton>
              <div className="flex">
                <PolIcon name="Plus" stroke="whitesmoke" className="my-auto hover:stroke-white" />
                <PolText className=" text-md my-auto ml-2">Add</PolText>
              </div>
            </PolButton>
          }
        >
          <Dropdown.Item className="rounded-lg">From existing</Dropdown.Item>

          <Dropdown.Item className="rounded-lg">
            <PolAttachmentUploader allowMultiple={true} className="h-full w-full" onUpload={onImageUpload}>
              <PolText className="text-left">New</PolText>
            </PolAttachmentUploader>
          </Dropdown.Item>
        </Dropdown>

        {equipment.Datasheets.length > 0 && (
          <PolButton onClick={deleteDatasheet}>
            <PolIcon name="Trash2" stroke="white" />
          </PolButton>
        )}
      </div>
      <div className="mx-auto flex w-fit gap-5">
        <PolButton variant="ghost" onClick={() => setCurrentDatasheetIndex((x) => x - 1)}>
          <PolIcon name="ChevronLeft" />
        </PolButton>

        <PolText className="my-auto">
          {equipment.Datasheets?.length === 0 ? 0 : currentDatasheetIndex + 1} of {equipment.Datasheets?.length}
        </PolText>

        <PolButton variant="ghost" onClick={() => setCurrentDatasheetIndex((x) => x + 1)}>
          <PolIcon name="ChevronRight" />
        </PolButton>
      </div>
    </div>
  );
};

export default EquipmentEditorDatasheetView;
