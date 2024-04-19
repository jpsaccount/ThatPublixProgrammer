import EntityImageManager from "@/components/EntityImageManager";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolInput from "@/components/polComponents/PolInput";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { ContentQuality } from "@/sdk/contracts/Entity";
import { Manufacturer } from "@/sdk/entities/project/equipment/Manufacturer";
import { Pattern } from "@/sdk/entities/project/equipment/Pattern";
import { useState } from "react";

interface Props {
  gobo: Pattern;
  onChange: (newProps: Partial<Pattern>) => void;
}

const GoboEditor = ({ gobo, onChange }: Props) => {
  const manufacturerRequest = useDbQuery(Manufacturer);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  if (!gobo) {
    return null;
  }

  return (
    <div>
      <EntityImageManager
        entity={gobo}
        onUpload={(files) => setCurrentFile(files[0])}
        currentFile={currentFile}
        quality={ContentQuality.Compressed}
      />
      <PolRequestPresenter
        request={manufacturerRequest}
        onSuccess={() => (
          <PolEntityDropdown
            label="Manufacturer"
            className="w-full"
            selectedId={gobo.ManufacturerId}
            options={manufacturerRequest.data}
            onValueChanged={(x) => onChange({ ManufacturerId: x.id })}
            nameGetter={(x) => x.Name}
          ></PolEntityDropdown>
        )}
      ></PolRequestPresenter>
      <PolInput label="Model Number" value={gobo.Model} onValueChanged={(e) => onChange({ Model: e })}></PolInput>
      <PolInput label="Name" value={gobo.Name} onValueChanged={(e) => onChange({ Name: e })}></PolInput>
    </div>
  );
};

export default GoboEditor;
