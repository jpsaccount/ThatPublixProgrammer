import { cn } from "@/lib/utils";
import { AttachmentEntity } from "@/sdk/contracts/Entity";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { ReactNode, useCallback, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";

interface Props<T> {
  onUpload: (fileList: FileList) => void | Promise<any>;
  className?: string;
  children?: React.ReactNode;
  isDisabled?: boolean;
  allowMultiple?: boolean;
  allowClick?: boolean;
  acceptedFileTypes?: Accept;
}

export default function PolAttachmentUploader<T extends AttachmentEntity>({
  onUpload,
  className,
  children,
  isDisabled = false,
  allowMultiple = false,
  allowClick,
  acceptedFileTypes,
}: Props<T>) {
  const handleOnChange = useCallback(
    (files) => {
      if (files && files.length > 0) {
        onUpload && onUpload(files);
      }
    },
    [onUpload],
  );
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleOnChange,
    multiple: allowMultiple,
    noClick: allowClick === false,

    accept: acceptedFileTypes,
  });
  const props = getInputProps();
  return (
    <div
      {...getRootProps()}
      onClick={() => {}}
      className={cn("stackGrid transition ", className, allowClick ? " cursor-pointer" : " cursor-default")}
    >
      <input
        {...props}
        onClick={(e) => {
          e.currentTarget.value = null;
        }}
      />

      <div className={"grid grid-flow-row transition "} onClick={open}>
        {children}
      </div>
    </div>
  );
}
