import { Attachment } from "@/sdk/entities/core/Attachment";
import { getEntityService } from "@/sdk/services/getEntityService";
import { isIphone } from "@/utilities/deviceUtils";
import Hls from "hls.js";
import React, { useEffect } from "react";

export default function useVideoStreaming(videoRef: React.MutableRefObject<any>, entity: Attachment) {
  const service = getEntityService(Attachment);

  useEffect(() => {
    if (entity == null) return;
    if (videoRef.current == null) return;

    service.createRoute(`m3u8/${entity.AttachmentMetadata.Path}/master.m3u8`).then((path) => {
      if (Hls.isSupported()) {
        var hls = new Hls();
        let fragLoadingTimer: number;
        hls.on(Hls.Events.FRAG_LOADING, () => {
          const lowerLevel = hls.nextAutoLevel - 2;
          if (lowerLevel === -1) return;
          fragLoadingTimer = window.setTimeout(() => {
            // Check if still on automatic quality selection
            if (hls.currentLevel === -1) {
              // Manually set to a lower quality level
              hls.currentLevel = lowerLevel;
              hls.nextAutoLevel = lowerLevel;
            }
          }, 3000);
        });

        hls.on(Hls.Events.FRAG_LOADED, () => {
          // Clear the timer when the fragment is loaded
          clearTimeout(fragLoadingTimer);
        });

        hls.loadSource(path);
        hls.attachMedia(videoRef.current);

        return () => {
          hls.stopLoad();
          hls.destroy();
        };
      } else {
        if (isIphone()) {
          videoRef.current.setAttribute("src", path);
        }
      }
    });
  }, [
    entity?.AttachmentMetadata.Path,
    entity?.AttachmentMetadata.ProcessingStatus,
    entity?.AttachmentMetadata.VersionId,
    videoRef,
  ]);
}
