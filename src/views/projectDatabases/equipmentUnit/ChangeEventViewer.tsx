import UserProfilePicture from "@/components/navbar/UserProfilePicture";
import PolText from "@/components/polComponents/PolText";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/customHooks/auth";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { ChangeEvent, ChangeLog } from "@/sdk/entities/core/ChangeEvent";
import { User } from "@/sdk/entities/core/User";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import React from "react";

interface Props {
  changeEvent: ChangeEvent;
  oldValue?: (value: ChangeLog) => any;
  newValue?: (value: ChangeLog) => any;
}
export default function ChangeEventViewer({ changeEvent, oldValue, newValue }: Props) {
  const userRequest = useDbQueryFirst(User, `WHERE c.id = "${changeEvent.EventByUserId}"`);
  const { user } = useAuth();
  return (
    <ScrollArea className="m-1 h-full border-b p-1">
      <div className="grid grid-flow-col grid-cols-[auto_1fr_auto]">
        <UserProfilePicture userId={userRequest.data?.id} size="1.25rem" className="mr-2 h-6 w-6" />
        <PolText type="bold">{user.id == userRequest.data?.id ? "You" : getFullName(userRequest.data?.Person)}</PolText>
        <PolText type="bold">{changeEvent.EventDateTime.local().format("MM-DD-YYYY hh:mm A")}</PolText>
      </div>
      <div className="m-1">
        {changeEvent.Changes.map((x) => {
          return (
            <PolText type="small">
              {x.PropertyChangedName} from "
              {oldValue
                ? oldValue(x)
                : typeof x.PreviousValue === "object"
                  ? JSON.stringify(x.PreviousValue)
                  : x.PreviousValue}
              " to "{newValue ? newValue(x) : typeof x.NewValue === "object" ? JSON.stringify(x.NewValue) : x.NewValue}"
            </PolText>
          );
        })}
      </div>
    </ScrollArea>
  );
}
