import CircleCheckBox from "@/components/polComponents/CircleCheckBox";
import PolIcon from "@/components/PolIcon";
import { useAuth } from "@/customHooks/auth";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import { Status } from "@/sdk/enums/Status";
import moment from "moment";

export default function FinishPunchListItem({
  punchListItem,
  onFinished,
}: {
  punchListItem: PunchListItem;
  onFinished?: () => void;
}) {
  const { user } = useAuth();
  const mutation = useDbUpsert(PunchListItem);

  const handleUpdate = async (e) => {
    e.stopPropagation();
    await mutation.mutateAsync({
      ...punchListItem,
      Status: Status.Completed,
      StatusChangedByUserId: user!.id,
      StatusLastChanged: moment(),
    });
    onFinished && onFinished();
  };
  return (
    <span onClick={handleUpdate} className=" mr-1 p-1">
      <CircleCheckBox isChecked={false} onClick={handleUpdate} onChange={handleUpdate}></CircleCheckBox>
    </span>
  );
}
