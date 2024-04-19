import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/customHooks/auth";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import UserProfilePicture from "./UserProfilePicture";

export function ProfileMenu(props: { onProfileClick: () => void; onSignoutClick: () => void }) {
  const { user } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserProfilePicture userId={user.id} className="h-8 w-8" size="1rem" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{getFullName(user.Person)}</DropdownMenuLabel>
        <DropdownMenuLabel>{user.Person.Emails[0]}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <button style={{ width: "100%" }} onClick={props.onProfileClick}>
          <DropdownMenuItem style={{ cursor: "pointer" }}>Profile</DropdownMenuItem>
        </button>
        <button style={{ width: "100%", cursor: "pointer" }} onClick={props.onSignoutClick}>
          <DropdownMenuItem style={{ cursor: "pointer" }}>Sign Out</DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
