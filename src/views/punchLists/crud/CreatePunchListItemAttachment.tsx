import PolAttachmentUploader from "@/components/polComponents/PolAttachmentUploader";
import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import { useDbAttachmentUpload } from "@/customHooks/sdkHooks/useDbAttachmentUpload";
import { PunchListItemAttachment } from "@/sdk/childEntities/PunchListItemAttachment";
import { Attachment } from "@/sdk/entities/core/Attachment";
import React, { useState } from "react";

interface Props {
  onComitted: (attachment: PunchListItemAttachment, file: File) => void;
}

export default function CreatePunchListItemAttachment({ onComitted }: Props) {
  const uploadMutation = useDbAttachmentUpload(Attachment);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  const [attachment, setAttachment] = useState(null);

  const handleAddAttachment = (file: FileList) => {
    setIsUploading(true);
    const fileToBeAttached = file[0];

    const attachment = new Attachment();

    setAttachment(attachment);
    setFile(fileToBeAttached);

    setIsUploading(false);
    setIsOpen(true);
  };

  const handleFinish = () => {
    const response = new PunchListItemAttachment();
    response.AttachmentId = attachment.Id;
    response.Title = title;
    onComitted(response, file);

    setIsOpen(false);
  };

  return (
    <>
      <PolAttachmentUploader isDisabled={isUploading} onUpload={handleAddAttachment}></PolAttachmentUploader>
      <PolModal
        isOpen={isOpen}
        onOpenChanged={(x) => {
          if (!x) {
            setAttachment(null);
            setTitle("");
            setIsOpen(x);
          }
        }}
        heading="Give your attachment a name"
      >
        <PolInput value={title} onValueChanged={setTitle} label="Title"></PolInput>
        <PolButton onClick={handleFinish}>Finish</PolButton>
      </PolModal>
    </>
  );
}
