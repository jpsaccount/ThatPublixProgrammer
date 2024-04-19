import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import PolIcon from "@/components/PolIcon";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";
import { set } from "node_modules/cypress/types/lodash";
import React, { useState } from "react";
import { s } from "vitest/dist/reporters-1evA5lom.js";

interface Props {
  onCreated: () => any;
}

export default function NewEquipmentType({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const mutation = useDbUpsert(EquipmentType);
  const [newEquipmentType, setNewEquipmentType] = useState<EquipmentType>(() => {
    return new EquipmentType();
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    await mutation.mutateAsync(newEquipmentType);
    setOpen(false);
    setIsLoading(false);
  };
  return (
    <PolModal
      isOpen={open}
      onOpenChanged={(x) => {
        if (!x) {
          setNewEquipmentType(new EquipmentType());
        }
        setOpen(x);
      }}
      modalTrigger={
        <PolButton variant="ghost">
          <PolIcon name="Plus"></PolIcon>
        </PolButton>
      }
    >
      <PolInput
        label="Code"
        value={newEquipmentType.Code}
        onValueChanged={(x) =>
          setNewEquipmentType((prev) => {
            return { ...prev, Code: x };
          })
        }
      ></PolInput>
      <PolButton isLoading={isLoading} onClick={handleSubmit}>
        Submit
      </PolButton>
    </PolModal>
  );
}
