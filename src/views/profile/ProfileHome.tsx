import UserProfilePicture from "@/components/navbar/UserProfilePicture";
import PolAttachmentUploader from "@/components/polComponents/PolAttachmentUploader";
import PolHeading from "@/components/polComponents/PolHeading";
import PolSpinner from "@/components/polComponents/PolSpinner";
import { useAuth } from "@/customHooks/auth";
import { useDbAttachmentUpload } from "@/customHooks/sdkHooks/useDbAttachmentUpload";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { ContentQuality } from "@/sdk/contracts/Entity";
import { Attachment } from "@/sdk/entities/core/Attachment";
import { User } from "@/sdk/entities/core/User";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useState } from "react";

interface Props {}

export default function ProfileHome({}: Props) {
  const { user } = useAuth();

  const [isUploading, setIsUploading] = useState(false);
  const upsertMutation = useDbUpsert(Attachment);
  const userUpsertMutation = useDbUpsert(User);
  const uploadMutation = useDbAttachmentUpload(Attachment);

  const attachmentRequest = useDbQueryFirst(Attachment, `WHERE c.id = "${user?.ProfileAttachmentId}"`, {
    enabled: isNullOrWhitespace(user?.ProfileAttachmentId) === false,
  });
  async function onImageUpload(files: FileList) {
    const file = files[0];
    setIsUploading(true);
    let attachment = attachmentRequest.data;
    if (isUsable(attachment) === false) {
      attachment = new Attachment();
      await upsertMutation.mutateAsync(attachment);
      await userUpsertMutation.mutateAsync({ ...user, ProfileAttachmentId: attachment.id });
    }
    await uploadMutation.mutateAsync([attachment, file]);
    setIsUploading(false);
  }

  return (
    <div>
      <PolHeading size={3}>Profile Home</PolHeading>
      <PolAttachmentUploader onUpload={onImageUpload}>
        {isUploading ? (
          <PolSpinner IsLoading={true} className="m-auto" />
        ) : (
          <UserProfilePicture
            userId={user.id}
            className="h-20 w-20"
            size="2rem"
            contentQuality={ContentQuality.Original}
          />
        )}
      </PolAttachmentUploader>
    </div>
  );
}
