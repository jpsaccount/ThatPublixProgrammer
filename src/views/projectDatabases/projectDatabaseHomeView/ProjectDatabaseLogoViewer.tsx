import { EntityAttachmentViewer } from "@/components/EntityAttachmentViewer";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { ContentQuality } from "@/sdk/contracts/Entity";
import { Logo } from "@/sdk/entities/core/Logo";

interface Props {
  logoId: string;
}
export default function ProjectDatabaseLogoViewer({ logoId }: Props) {
  const clientLogoRequest = useDbQueryFirst(Logo, `WHERE c.id = "${logoId}"`);

  return (
    <EntityAttachmentViewer
      entity={clientLogoRequest.data}
      quality={ContentQuality.CompressedThumbnail}
      viewerClassName="w-14 h-14 aspect-1 mx-auto"
      className="mx-auto bg-slate-200 rounded-full"
    />
  );
}
