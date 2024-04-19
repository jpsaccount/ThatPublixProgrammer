import PolDropdownModal from "@/components/polComponents/PolDropdownModal";
import PolInput from "@/components/polComponents/PolInput";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useEquipmentUnitEditorViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag.lazy";
import { PunchList } from "@/sdk/entities/punchList/PunchList";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";

interface Props {
  punchListItem: PunchListItem;
  onPunchListItemChanged: (punchListItem: PunchListItem) => any;
}
export default function EquipmentUnitPunchListEditor({ punchListItem, onPunchListItemChanged }: Props) {
  const { projectDatabaseId } = useEquipmentUnitEditorViewParams();
  const punchListRequests = useDbQuery(PunchList, `WHERE c.ProjectDatabaseId = "${projectDatabaseId}"`);
  return (
    <div className="grid grid-flow-row gap-5">
      <PolDropdownModal
        disableSearchBar
        label="Punch List"
        columns={[{ id: "Title" }]}
        nameGetter={(x) => x.Title}
        selectedId={punchListItem.PunchListId}
        options={punchListRequests.data}
        onValueChanged={(e) => {
          onPunchListItemChanged({ ...punchListItem, PunchListId: e });
        }}
      />
      <PolInput
        label="Title"
        value={punchListItem.Title}
        onValueChanged={(e) => onPunchListItemChanged({ ...punchListItem, Title: e })}
      />
      <PolInput
        label="Description"
        value={punchListItem.Description}
        onValueChanged={(e) => onPunchListItemChanged({ ...punchListItem, Description: e })}
      />
    </div>
  );
}
