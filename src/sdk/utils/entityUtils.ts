import { SdkOptions } from "../models/SdkOptions";
import { AttachmentEntity, ContentQuality } from "../contracts/Entity";
import { getEntityRouteByEntityId } from "../services/Http/getEntityRoute";
import { getEntityTypeId } from "../sdkconfig/EntityTypeId";
import diContainer from "../sdkconfig/SdkSetup";
import { isUsable } from "./usabilityUtils";

export function getAttachmentContentUrl<T extends AttachmentEntity>(
  entityType: {
    new (...args: unknown[]): T;
  },
  entity: T,
  quality: ContentQuality,
) {
  if (isUsable(entity) == false) return;
  const options = diContainer.resolve<SdkOptions>(SdkOptions);
  const entityId = getEntityRouteByEntityId(getEntityTypeId(entityType));
  const url =
    options.ServerPath + entityId + `${entity.id}/Content/${entity.AttachmentMetadata.VersionId}?quality=${quality}`;
  return url;
}
