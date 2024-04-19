import PolInput from "@/components/polComponents/PolInput";
import { NewProjectFormItemProps } from "@/views/projects/CreateNewProjectForm/NewProjectFormItemProps";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { Client } from "@/sdk/entities/project/Client";
import { useState } from "react";

export function NewProjectDetailEntry({ project, updateProject }: NewProjectFormItemProps) {
  const [hasChangedQboName, setHasChangedQboName] = useState(false);
  const [hasChangedNickname, setHasChangedNickname] = useState(false);

  return (
    <>
      <PolInput
        autoFocus
        type="text"
        label="Project Name"
        value={project.Name}
        onValueChanged={(value) =>
          updateProject({
            Name: value,
            QboProjectName: hasChangedQboName ? project.QboProjectName : value,
            Nickname: hasChangedNickname ? project.Nickname : value,
          })
        }
      />
      <PolInput
        type="text"
        label="QBO Name"
        value={project.QboProjectName}
        onValueChanged={(value) => {
          setHasChangedQboName(true);
          updateProject({ QboProjectName: value });
        }}
      />
      <PolInput
        type="text"
        label="Display Name"
        value={project.Nickname}
        onValueChanged={(value) => {
          setHasChangedNickname(true);
          updateProject({ Nickname: value });
        }}
      />
    </>
  );
}

export function NewProjectClientEntry({ project, updateProject }: NewProjectFormItemProps) {
  const clients = useDbQuery(Client);
  return (
    <>
      <PolEntityDropdown
        data-testid={"client-dropdown"}
        required
        selectedId={project.ClientId}
        options={clients.data}
        onValueChanged={(value) => updateProject({ ClientId: value.id })}
        nameGetter={(x) => x.DisplayName}
      />
    </>
  );
}
