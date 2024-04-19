import { AttachmentEntity, ContentQuality, ContentType } from "@sdk/./contracts/Entity";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import { useLayoutEffect, useMemo, useState } from "react";
import { Document, Page } from "react-pdf";
import { PolImageViewer } from "./PolImageViewer";

import styled from "styled-components";
import { ScrollArea } from "./ui/scroll-area";
import { PolButton } from "./polComponents/PolButton";
import PolIcon from "./PolIcon";
const PDFDocumentWrapper = styled.div`
  canvas {
    max-width: 100% !important;
    max-height: 100% !important;
    height: auto !important;
    width: auto !important;
    margin: auto;
  }
`;

export interface EntityImageViewerProps {
  entity: AttachmentEntity;
  quality: ContentQuality;
  className?: string;
  viewerClassName?: string;
  isLazyLoading?: boolean;
  onClick?: (content) => void;
  downloadable?: boolean;
  downloadFileName?: string;
}

export function EntityAttachmentViewer<T extends AttachmentEntity>({
  entity,
  quality,
  onClick,
  ...props
}: EntityImageViewerProps) {
  const [currentQuality, setCurrentQuality] = useState(quality);
  const currentSrc = useMemo(
    () => entity?.AttachmentMetadata?.AttachmentLinks?.find((x) => x?.ContentQuality == currentQuality)?.Url,
    [currentQuality, entity?.AttachmentMetadata?.AttachmentLinks],
  );

  const originalSrc = entity?.AttachmentMetadata?.AttachmentLinks?.find(
    (x) => x?.ContentQuality == ContentQuality.Original,
  )?.Url;

  useLayoutEffect(() => {
    setCurrentQuality(quality);
  }, [entity?.AttachmentMetadata?.AttachmentLinks]);
  const pixelWidth = Number(entity?.AttachmentMetadata?.Dimensions.PixelWidth ?? 0);
  const pixelHeight = Number(entity?.AttachmentMetadata?.Dimensions.PixelHeight ?? 0);

  const aspectRatio = pixelWidth / pixelHeight;
  const handleError = () => {
    if (currentQuality === ContentQuality.Original) return;
    const nextQuality = currentQuality + 1;
    setCurrentQuality(nextQuality);
  };

  if (isUsable(currentSrc) === false && currentQuality !== ContentQuality.Original) {
    handleError();
  }

  if (entity?.AttachmentMetadata.HasAttachment === false) {
    return <></>;
  }

  const [hasError, setHasError] = useState(false);

  return entity?.AttachmentMetadata?.ContentType === ContentType.PDF &&
    currentQuality === ContentQuality.Original &&
    hasError === false ? (
    <div className="stackGrid">
      <ScrollArea className={props.viewerClassName + " m-auto"}>
        <PDFDocumentWrapper>
          <Document file={currentSrc} onError={() => setHasError(true)}>
            <Page
              pageNumber={1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className={props.viewerClassName + " m-auto"}
            />
          </Document>
        </PDFDocumentWrapper>
      </ScrollArea>
      <PolButton href={originalSrc} className="ml-auto" variant="ghost">
        <PolIcon name="Download" />
      </PolButton>
    </div>
  ) : (
    <PolImageViewer
      {...props}
      imgClassName={props.viewerClassName}
      currentSrc={currentSrc}
      originalSrc={originalSrc}
      aspectRatio={aspectRatio}
      onError={handleError}
      onClick={() => onClick && onClick(entity)}
    />
  );
}
