import { EntityAttachmentViewer } from "@/components/EntityAttachmentViewer";
import PolIcon from "@/components/PolIcon";
import PolAttachmentUploader from "@/components/polComponents/PolAttachmentUploader";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import PolModal from "@/components/polComponents/PolModal";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import PolSpinner from "@/components/polComponents/PolSpinner";
import PolText from "@/components/polComponents/PolText";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDbAttachmentUpload } from "@/customHooks/sdkHooks/useDbAttachmentUpload";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { ContentQuality } from "@/sdk/contracts/Entity";
import { FocusPhoto } from "@/sdk/entities/project/equipment/FocusPhoto";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { range } from "@/utilities/arrayUtilities";
import { Dropdown } from "flowbite-react";
import { useState } from "react";
interface Props {
  equipmentUnitId: string;
}

const FocusPhotoDisplay = ({ equipmentUnitId }: Props) => {
  const [selectedPhoto, setSelectedPhoto] = useState<FocusPhoto | null>(null);
  const focusPhotosRequest = useDbQuery(
    FocusPhoto,
    `WHERE c.EquipmentUnitId = "${equipmentUnitId}" ORDER BY c.ModifiedDateTime DESC`,
    { staleTime: 0 },
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const equipmentUnitRequest = useDbQueryFirst(LightingFixtureUnit, `WHERE c.id = "${equipmentUnitId}"`);
  const upsertMutation = useDbUpsert(FocusPhoto);
  const uploadMutation = useDbAttachmentUpload(FocusPhoto);
  const deleteMutation = useDbDelete(FocusPhoto);

  async function onImageUpload(files: FileList) {
    const file = files[0];
    setIsUploading(true);
    let mediaContent = new FocusPhoto();
    mediaContent.EquipmentUnitId = equipmentUnitId;
    await upsertMutation.mutateAsync(mediaContent);
    await uploadMutation.mutateAsync([mediaContent, file]);
    focusPhotosRequest.refetch();
    setIsUploading(false);
  }

  async function onDelete() {
    setIsDeleting(true);
    await deleteMutation.mutateAsync(selectedPhoto);
    setSelectedPhoto(null);
    setIsDeleting(false);
  }

  function moveBack() {
    if (isUsable(focusPhotosRequest.data) === false) return;
    let currentIndex = focusPhotosRequest.data.indexOf(selectedPhoto);
    if (currentIndex === 0) {
      currentIndex = focusPhotosRequest.data.length;
    }

    setSelectedPhoto(focusPhotosRequest.data[currentIndex - 1]);
  }

  function moveForward() {
    if (isUsable(focusPhotosRequest.data) === false) return;
    let currentIndex = focusPhotosRequest.data.indexOf(selectedPhoto);
    if (currentIndex === focusPhotosRequest.data.length - 1) {
      currentIndex = -1;
    }

    setSelectedPhoto(focusPhotosRequest.data[currentIndex + 1]);
  }
  return (
    <>
      <PolModal
        className="md:w-[80dvw]"
        onClose={() => setSelectedPhoto(null)}
        heading={
          <div className="grid grid-flow-col grid-cols-[auto_1fr] ">
            <Dropdown className="z-[10000]" arrowIcon={false} inline label={<PolIcon name="MoreVertical"></PolIcon>}>
              <Dropdown.Item className="rounded-lg" onClick={onDelete}>
                Delete
              </Dropdown.Item>
            </Dropdown>

            <PolText type="bold" className="mx-auto">
              Focus Photo
            </PolText>
          </div>
        }
        isOpen={selectedPhoto !== null}
      >
        <div className="grid grid-flow-row grid-rows-[1fr_auto]">
          {isDeleting ? (
            <PolSpinner IsLoading={true} className="m-auto" />
          ) : (
            <EntityAttachmentViewer
              downloadable
              downloadFileName={equipmentUnitRequest.data?.UnitId}
              className="mx-auto h-[80dvh] lg:h-[70dvh]"
              viewerClassName="m-auto lg:h-[70dvh] h-[80dvh]"
              quality={ContentQuality.Original}
              entity={selectedPhoto}
            ></EntityAttachmentViewer>
          )}
          <div className="notch-safe mt-auto grid w-full grid-flow-col grid-cols-[auto_1fr_auto] md:mt-8 ">
            <PolButton variant="ghost" onClick={moveBack}>
              <PolIcon name="ChevronLeft" />
            </PolButton>
            <div className="m-auto ">
              <PolText>
                {focusPhotosRequest.data?.indexOf(selectedPhoto) + 1} / {focusPhotosRequest.data?.length}
              </PolText>
            </div>
            <PolButton variant="ghost" onClick={moveForward}>
              <PolIcon name="ChevronRight" />
            </PolButton>
          </div>
        </div>
      </PolModal>
      <Card className=" h-full w-[33dvw] max-sm:w-screen">
        <CardHeader>
          <div className="grid grid-flow-col grid-cols-[1fr_auto]">
            <PolHeading size={3}>Focus Photos</PolHeading>
            <PolHeading size={3}>
              {focusPhotosRequest.data?.length ?? equipmentUnitRequest.data?.MediaContentsCount}
            </PolHeading>
          </div>
        </CardHeader>
        <CardContent>
          <PolRequestPresenter
            containerClassName="m-1 grid w-full auto-rows-auto grid-cols-3 gap-2"
            request={focusPhotosRequest}
            onLoading={() =>
              range(equipmentUnitRequest.data?.MediaContentsCount + 1, 0).map((x) => (
                <PolSkeleton className="aspect-square h-full " />
              ))
            }
            onSuccess={() => (
              <>
                {focusPhotosRequest.data.map((x) => (
                  <div className="stackGrid">
                    <EntityAttachmentViewer
                      onClick={(photo) => setSelectedPhoto(photo)}
                      viewerClassName="object-cover cursor-pointer hover:opacity-80 transition-all aspect-square	"
                      quality={ContentQuality.CompressedThumbnail}
                      entity={x}
                    ></EntityAttachmentViewer>
                    {x.IsOfficial && (
                      <div className="m-1 h-fit w-fit rounded-full border bg-background-100">
                        <PolIcon name="Check" stroke="var(--primary-500)" />
                      </div>
                    )}
                  </div>
                ))}
                <PolAttachmentUploader
                  acceptedFileTypes={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
                  className="cursor-pointer"
                  onUpload={onImageUpload}
                  isDisabled={isUploading}
                >
                  <div className="flex aspect-[1] h-full rounded bg-accent-100 transition-all hover:opacity-80">
                    {isUploading ? (
                      <PolSpinner IsLoading={true} className="m-auto" />
                    ) : (
                      <PolIcon name="PlusCircle" className="m-auto cursor-pointer"></PolIcon>
                    )}
                  </div>
                </PolAttachmentUploader>
              </>
            )}
          ></PolRequestPresenter>
        </CardContent>
      </Card>
    </>
  );
};

export default FocusPhotoDisplay;
