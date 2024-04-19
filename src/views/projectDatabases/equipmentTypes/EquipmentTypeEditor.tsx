import EntityImageManager from "@/components/EntityImageManager";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolInput from "@/components/polComponents/PolInput";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { ContentQuality } from "@/sdk/contracts/Entity";
import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";
import { Manufacturer } from "@/sdk/entities/project/equipment/Manufacturer";
import { Pattern } from "@/sdk/entities/project/equipment/Pattern";
import { useState } from "react";

interface Props {
  equipmentType: EquipmentType;
  onChange: (newProps: Partial<EquipmentType>) => void;
}

export default function EquipmentTypeEditor({ equipmentType, onChange }: Props) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  if (!equipmentType) {
    return null;
  }

  return (
    <div>
      <PolInput label="Code" value={equipmentType.Code} onValueChanged={(e) => onChange({ Code: e })}></PolInput>
    </div>
  );
}
