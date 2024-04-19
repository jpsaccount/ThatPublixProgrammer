import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { User } from "@/sdk/entities/core/User";
import { Role } from "@sdk/./entities/billing/Role";
import { TimeActivity } from "@sdk/./entities/billing/TimeActivity";
import { getFullName } from "@sdk/./utils/entityUtils/userUtils";

interface Props {
  timeActivity: TimeActivity;
}

const TimeActivityUserDescription = ({ timeActivity }: Props) => {
  const userRequest = useDbQueryFirst(User, `WHERE c.id = "${timeActivity.UserId}"`);

  const roleRequest = useDbQueryFirst(Role, `WHERE c.id = "${timeActivity.RoleId}"`);

  return (
    <>
      <p className="text-start text-sm font-medium leading-none transition">
        <PolRequestPresenter
          request={[userRequest, roleRequest]}
          onLoading={() => <PolSkeleton className="h-[14px] " />}
          onSuccess={() =>
            `${getFullName(userRequest.data?.Person)} - ${roleRequest.data?.Title} - ${timeActivity.Description}`
          }
        ></PolRequestPresenter>
      </p>
    </>
  );
};

export default TimeActivityUserDescription;
