import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import { useState } from "react";

interface Props {
  onSaved?: (projectDatabase: ProjectDatabase) => any;
}
export default function CreateProjectDatabaseView({ onSaved }: Props) {
  const [newProjectDatabase, setNewProjectDatabase] = useState<ProjectDatabase>(new ProjectDatabase());

  const save = useDbUpsert(ProjectDatabase);
  const handleChange = (newProps: Partial<ProjectDatabase>) => {
    setNewProjectDatabase((prev) => {
      return { ...prev, ...newProps };
    });
  };

  return (
    <div className="grid grid-flow-row gap-4">
      <PolInput
        className="w-96"
        onValueChanged={(x) => handleChange({ Name: x })}
        value={newProjectDatabase.Name}
        label="Name"
      ></PolInput>
      <PolInput
        className="w-96"
        onValueChanged={(x) => handleChange({ Description: x })}
        value={newProjectDatabase.Description}
        label="Description"
      ></PolInput>
      <PolButton
        className="mx-auto"
        onClick={() => save.mutateAsync(newProjectDatabase).then((x) => onSaved && onSaved(x))}
      >
        Create
      </PolButton>
    </div>
  );
}
