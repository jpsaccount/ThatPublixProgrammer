import { useAuth } from "@/customHooks/auth";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { cn } from "@/lib/utils";
import { ContentQuality } from "@/sdk/contracts/Entity";
import { Attachment } from "@/sdk/entities/core/Attachment";
import { User } from "@/sdk/entities/core/User";
import { getFirstName, getLastName } from "@/sdk/utils/entityUtils/userUtils";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { EntityAttachmentViewer } from "../EntityAttachmentViewer";
import { PolRequestPresenter } from "../polComponents/PolRequestPresenter";
import PolSpinner from "../polComponents/PolSpinner";
import PolText from "../polComponents/PolText";
import { isUsable } from "@/sdk/utils/usabilityUtils";

interface Props {
  userId: string;
  className?: string;
  size?: string;
  contentQuality?: ContentQuality;
}

export default function UserProfilePicture({
  userId,
  className = "w-10 h-10",
  size = "1rem",
  contentQuality = ContentQuality.Compressed,
}: Props) {
  const userRequest = useDbQueryFirst(User, `WHERE c.id = "${userId}"`, {
    enabled: isNullOrWhitespace(userId) === false,
  });
  const user = userRequest.data;
  const attachmentRequest = useDbQueryFirst(Attachment, `WHERE c.id = "${user?.ProfileAttachmentId}"`, {
    enabled: isNullOrWhitespace(user?.ProfileAttachmentId) === false,
  });

  const fallBack = (
    <PolText className={cn("m-auto p-0 leading-[unset] text-text-50")}>
      {user ? getFirstName(user.Person)[0] + getLastName(user.Person)[0] : ""}
    </PolText>
  );

  return (
    <div
      className={cn("m-auto cursor-pointer rounded-full bg-primary-700 transition hover:bg-primary-800 ", className)}
    >
      <PolRequestPresenter
        containerClassName="grid"
        request={[attachmentRequest, userRequest]}
        showWhenPending={true}
        onLoading={() => (
          <div className="center-Items grid h-full">
            <PolSpinner className={cn("m-auto h-full", className)} variant="secondary" IsLoading={true} />
          </div>
        )}
        onFailure={() => fallBack}
        onSuccess={() =>
          attachmentRequest.data ? (
            <EntityAttachmentViewer
              className="m-auto"
              viewerClassName={cn("transition rounded-full object-cover ", className)}
              entity={attachmentRequest.data}
              quality={contentQuality}
            />
          ) : (
            fallBack
          )
        }
      />
    </div>
  );
}
