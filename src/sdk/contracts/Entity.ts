import { Moment } from "moment/moment";
import { newUuid } from "../utils/uuidUtils";
import { IEntity } from "./IEntity";
import moment from "moment/moment";

export class Entity implements IEntity {
  id: string = crypto.randomUUID ? crypto.randomUUID() : newUuid();
  TenantId: string;
  _etag: string;
  CreatedByUserId: string;
  ModifiedByUserId: string;
  CreatedDateTime: Moment = moment();
  ModifiedDateTime: Moment = moment().utc();
}

export class AttachmentEntity extends Entity implements IEntity {
  AttachmentMetadata: AttachmentMetadata = new AttachmentMetadata();
}

class AttachmentMetadata {
  Length: bigint;
  HasAttachment: boolean;
  VersionId: string;
  Path: string;
  LastUpdated: Moment;
  ProcessingStatus: ProcessingStatus;
  FromUserId: string;
  Dimensions: ContentDimensions = new ContentDimensions();
  ContentType: ContentType = ContentType.Unknown;
  AttachmentLinks: Array<AttachmentLink> = [];
}

export enum ContentType {
  Unknown,
  JPG,
  PDF,
  PNG,
  GIF,
  XLSX,
}

class AttachmentLink {
  ContentQuality: ContentQuality;
  ExpiresOn: Moment;
  Url: string;
}

class ContentDimensions {
  PixelWidth: bigint;
  PixelHeight: bigint;
}

export enum ProcessingStatus {
  None,
  Processing,
  Error,
}

export enum ContentQuality {
  None,
  CompressedThumbnail,
  Thumbnail,
  Compressed,
  LightlyCompressed,
  Original,
}
