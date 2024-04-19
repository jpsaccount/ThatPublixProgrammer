import { ContentType } from "../contracts/Entity";

export function getExtension(contentType: ContentType) {
  switch (contentType) {
    case ContentType.Unknown:
      return ".txt";
    case ContentType.JPG:
      return ".jpg";
    case ContentType.PNG:
      return ".png";
    case ContentType.PDF:
      return ".pdf";
    case ContentType.GIF:
      return ".gif";
    case ContentType.XLSX:
      return ".xlsx";
    default:
      return "";
  }
}
