import { cn } from "@/lib/utils";
import { AttachmentEntity } from "@sdk/./contracts/Entity";
import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import PolIcon from "./PolIcon";
import { PolButton } from "./polComponents/PolButton";
import PolSkeleton from "./polComponents/PolSkeleton";

export interface PolImageViewerProps {
  className?: string;
  imgClassName?: string;
  isLazyLoading?: boolean;
  downloadable?: boolean;
  downloadFileName?: string;
  currentSrc?: string;
  originalSrc?: string;
  onClick?: () => void;
  onError?: () => void;
  aspectRatio?: Number;
}
function imgLoaded(imgElement: HTMLImageElement) {
  if (imgElement == null) return false;
  return imgElement.complete && imgElement.naturalHeight !== 0;
}
export function PolImageViewer<T extends AttachmentEntity>({
  className,
  imgClassName,
  isLazyLoading = true,
  downloadable = false,
  downloadFileName,
  currentSrc,
  originalSrc,
  onClick,
  onError,
  aspectRatio,
}: PolImageViewerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    setIsLoaded(false);
  }, [currentSrc]);

  useLayoutEffect(() => {
    const imageLoaded = imgLoaded(img.current);
    if (imageLoaded) setIsLoaded(imageLoaded);
  }, [img.current?.currentSrc]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("stackGrid w-fit ", className)}
    >
      <AnimatePresence>
        <motion.img
          key={currentSrc}
          ref={img}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClick}
          src={currentSrc}
          onError={onError}
          loading={isLazyLoading ? "lazy" : "eager"}
          className={cn(`object-contain aspect-[${aspectRatio}] m-auto`, imgClassName)}
          onLoad={() => setIsLoaded(true)}
        />
        {isLoaded === false && <PolSkeleton key={"imageLoadingSkeleton"} className="h-full w-full" />}
      </AnimatePresence>
      <AnimatePresence>
        {downloadable && isLoaded && (
          <motion.a
            onClick={(e) => e.stopPropagation()}
            animate={{ opacity: isLoaded && isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            target="_blank"
            className={
              "clearLink m-auto rounded-md border bg-background-t-50 p-2 backdrop-blur		" +
              (isLoaded && currentSrc ? "cursor-pointer" : "")
            }
            href={originalSrc}
            download={downloadFileName}
          >
            <PolButton variant="ghost" className=" p-2 hover:bg-transparent">
              <PolIcon name="Download" className="m-auto"></PolIcon>
            </PolButton>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
