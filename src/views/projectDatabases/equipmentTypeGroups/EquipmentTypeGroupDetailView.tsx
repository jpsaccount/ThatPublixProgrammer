import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import PolLoadingSection from "@/components/polComponents/PolLoadingSection";
import { CardContent, CardHeader } from "@/components/ui/card";
import { LiveChangeContextProvider } from "@/contexts/LiveChangeContext";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import useLiveChangeTracking from "@/customHooks/useLiveChangeTracking";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { EquipmentConfigurationGroup } from "@/sdk/entities/project/EquipmentConfigurationGroup";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useEffect, useState } from "react";

interface Props {
  equipmentTypeGroup?: EquipmentConfigurationGroup;
  onSave: (equipmentTypeGroup: EquipmentConfigurationGroup) => any;
}

export default function EquipmentTypeGroupDetailView({ equipmentTypeGroup, onSave }: Props) {
  const [equipmentTypeGroupId, setEquipmentTypeGroupId] = useSearchParamState("id", equipmentTypeGroup.id);

  const equipmentTypeGroupRequest = useDbQueryFirst(
    EquipmentConfigurationGroup,
    `WHERE c.id = '${equipmentTypeGroupId}'`,
    {
      enabled: isUsable(equipmentTypeGroupId),
    },
  );

  const mutation = useDbUpsert(EquipmentConfigurationGroup);

  const [value, setEquipmentTypeGroup] = useState(new EquipmentConfigurationGroup());

  useEffect(() => {
    if (equipmentTypeGroupRequest.data) setEquipmentTypeGroup(equipmentTypeGroupRequest.data);
  }, [equipmentTypeGroupRequest.data]);

  useEffect(() => {
    setEquipmentTypeGroup(equipmentTypeGroup);
  }, [equipmentTypeGroup]);

  const changeLog = useLiveChangeTracking(equipmentTypeGroupRequest, (updates) => {
    setEquipmentTypeGroup((x) => ({ ...x, ...updates }));
  });
  function onChange(updates: Partial<EquipmentConfigurationGroup>) {
    setEquipmentTypeGroup((x) => ({ ...x, ...updates }));
  }

  async function save() {
    await mutation.mutateAsync(value);
    onSave && onSave(value);
  }
  return (
    <LiveChangeContextProvider changeLog={changeLog}>
      <PolLoadingSection isLoading={equipmentTypeGroupRequest.isLoading || isUsable(equipmentTypeGroup) === false}>
        <div className="m-auto gap-2">
          <CardHeader className="bg-transparent">New Equipment Type Group</CardHeader>
          <CardContent className="flex flex-col gap-2">
            <PolInput label="Name" value={value.Name} onValueChanged={(e) => onChange({ Name: e })}></PolInput>

            <PolInput
              label="Description"
              value={value.Description}
              onValueChanged={(e) => onChange({ Description: e })}
            ></PolInput>

            <PolInput label="Notes" value={value.Notes} onValueChanged={(e) => onChange({ Notes: e })}></PolInput>

            <PolButton onClick={save}>Save</PolButton>
          </CardContent>
        </div>
      </PolLoadingSection>
    </LiveChangeContextProvider>
  );
}
