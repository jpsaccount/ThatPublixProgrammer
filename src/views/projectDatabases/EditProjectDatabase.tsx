import { PolButton } from "@/components/polComponents/PolButton";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolInput from "@/components/polComponents/PolInput";
import PolText from "@/components/polComponents/PolText";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { usePartialState } from "@/customHooks/usePartialState";
import { EquipmentConfigurationGroup } from "@/sdk/entities/project/EquipmentConfigurationGroup";
import { ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import { useState } from "react";

interface Props {
  projectDatabase: ProjectDatabase;
}

const EditProjectDatabase = ({ projectDatabase }: Props) => {
  const { state, setState } = usePartialState<ProjectDatabase>(projectDatabase);

  const [equipmentTypeGroup, setEquipmentTypeGroup] = useState<EquipmentConfigurationGroup>();

  const equipmentTypeGroupRequest = useDbQuery(EquipmentConfigurationGroup);

  return (
    <div className="flex flex-col">
      <PolInput value={state.Name} label="Name" onValueChanged={(x) => setState({ Name: x })}></PolInput>
      <PolInput
        value={state.Description}
        label="Description"
        onValueChanged={(x) => setState({ Description: x })}
      ></PolInput>
      <div className="grid grid-flow-row">
        <PolEntityDropdown
          nameGetter={(e) => e.Name}
          value={equipmentTypeGroup}
          onValueChanged={(value) => setEquipmentTypeGroup(value)}
          optionsRequest={equipmentTypeGroupRequest}
        />
        {state.EquipmentTypeGroups.map((x) => (
          <PolText>{x}</PolText>
        ))}
      </div>
      <PolButton className="mx-auto mt-5">Save</PolButton>
    </div>
  );
};

export default EditProjectDatabase;
