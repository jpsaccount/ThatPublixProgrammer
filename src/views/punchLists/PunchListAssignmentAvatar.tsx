import UserProfilePicture from "@/components/navbar/UserProfilePicture";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { ContentQuality } from "@/sdk/contracts/Entity";
import { Attachment } from "@/sdk/entities/core/Attachment";
import { User } from "@/sdk/entities/core/User";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import React, { Fragment } from "react";

interface Props {
  userId: string;
}

export default function PunchListAssignmentAvatar({ userId }: Props) {
  return (
    <Fragment key={userId}>
      <span className="-mr-3">
        <UserProfilePicture
          contentQuality={ContentQuality.LightlyCompressed}
          userId={userId}
          className="h-10 w-10 rounded-full"
        />
      </span>
    </Fragment>
  );
}
