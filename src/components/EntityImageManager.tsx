import { AttachmentEntity, ContentQuality, ProcessingStatus } from "@/sdk/contracts/Entity";
import { EntityAttachmentViewer, EntityImageViewerProps } from "./EntityAttachmentViewer";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import PolIcon from "./PolIcon";
import PolAttachmentUploader from "./polComponents/PolAttachmentUploader";
import PolText from "./polComponents/PolText";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { PolButton } from "./polComponents/PolButton";

interface Props<T extends AttachmentEntity> extends EntityImageViewerProps {
  entity: T;
  currentFile: File | null;
  onUpload: (fileList: FileList | null) => void | Promise<void>;
  containerClassName?: string;
  uploaderClassName?: string;
  showPreview?: boolean;
  uploadAttachmentContent?: ReactNode;
}

export default function EntityImageManager<T extends AttachmentEntity>({
  entity,
  onUpload,
  currentFile,
  containerClassName,
  uploaderClassName,
  showPreview = true,
  uploadAttachmentContent,
  ...props
}: Props<T>) {
  const [currentFileSource, setCurrentFileSource] = useState<string | null>(null);
  useEffect(() => {
    if (currentFile) setCurrentFileSource(URL.createObjectURL(currentFile));
    else setCurrentFileSource(null);
  }, [currentFile]);
  const handleOnChange = useCallback((files) => {
    if (files && files.length > 0) {
      onUpload && onUpload(files);
    }
  }, []);
  const hasAttachment = entity?.AttachmentMetadata?.HasAttachment === true || isUsable(currentFile);
  const isProcessing = entity?.AttachmentMetadata?.ProcessingStatus === ProcessingStatus.Processing;
  return (
    <div>
      {currentFileSource !== null && (
        <PolButton variant="ghost" className="m-1 px-3" onClick={() => onUpload(null)}>
          <div className="grid grid-flow-col space-x-2">
            <PolIcon name="Undo" size="1rem" className="my-auto" />
            <PolText>Undo</PolText>
          </div>
        </PolButton>
      )}
      {showPreview && (
        <EntityAttachmentViewer
          entity={entity}
          {...props}
          viewerClassName={props.viewerClassName}
          {...(isProcessing && { quality: ContentQuality.Original })}
        />
      )}
      <PolAttachmentUploader onUpload={handleOnChange} className={containerClassName}>
        {hasAttachment ? (
          isProcessing ? (
            "Attachment currently processing..."
          ) : (
            "Click to replace file"
          )
        ) : uploadAttachmentContent ? (
          uploadAttachmentContent
        ) : (
          <div className=" m-auto grid aspect-square w-fit rounded-md border border-black p-5 transition hover:bg-primary-50">
            <PolIcon name="Upload" className="mx-auto mt-auto" />
            <PolText>Upload attachment</PolText>
          </div>
        )}
      </PolAttachmentUploader>
    </div>
  );
}
