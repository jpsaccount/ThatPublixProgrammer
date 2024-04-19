import React, { useEffect, useState } from "react";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { PolButton } from "../polComponents/PolButton";
import PolInput from "../polComponents/PolInput";
import PolModal from "../polComponents/PolModal";
import { Entity } from "@/sdk/contracts/Entity";
import { PolDropdown } from "../polComponents/PolDropdown";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import HoldButton from "../HoldButton";

interface Props<T extends Entity> {
  entity: T;
  properties: { property: keyof T; options?: { name: string; value: any }[] }[];
  entityType: new (...args: any[]) => T;
  trigger?: React.ReactNode;
  showDelete?: boolean;
}

const UpdateEntity = <T extends Entity>({ trigger, entity, properties, entityType, showDelete = false }: Props<T>) => {
  const [open, setOpen] = useState(false);
  const [updatedEntity, setUpdatedEntity] = useState<T | null>(null);

  const mutate = useDbUpsert<T>(entityType);
  const [isLoading, setIsLoading] = useState(false);
  const deleteMutation = useDbDelete(entityType);

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteMutation.mutateAsync(entity);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!open) return;
    setUpdatedEntity(entity);
  }, [open, entity]);

  const handleChange = (property: keyof T, value: any) => {
    setUpdatedEntity((prev) => ({
      ...prev!,
      [property]: value,
    }));
  };

  const handleSave = async () => {
    if (!updatedEntity) return;
    setIsLoading(true);
    await mutate.mutateAsync(updatedEntity);
    setOpen(false);
    setIsLoading(false);
  };

  return (
    <PolModal
      isOpen={open}
      onOpenChanged={setOpen}
      modalTrigger={trigger ? trigger : <PolButton variant="outline">Edit</PolButton>}
    >
      {properties.map((property, index) => {
        if (!property.options) {
          return (
            <PolInput
              key={index}
              value={updatedEntity?.[property.property]}
              onValueChanged={(value) => handleChange(property.property, value)}
              label={property.property.toString()}
            ></PolInput>
          );
        } else {
          return (
            <PolDropdown
              label={property.property.toString()}
              nameGetter={(x) => x.name}
              value={property.options.find((x) => x.value === updatedEntity?.[property.property])}
              options={property.options}
              onValueChanged={(x) => handleChange(property.property, x)}
            ></PolDropdown>
          );
        }
      })}
      <div className="mt-2 flex items-center justify-center gap-1">
        <PolButton className=" w-full" isLoading={isLoading} variant="outline" onClick={handleSave}>
          Save
        </PolButton>
        <HoldButton
          holdDuration={2000}
          isLoading={isLoading}
          onClick={handleDelete}
          variant="destructive"
          className="w-full"
        >
          Hold To Delete
        </HoldButton>
      </div>
    </PolModal>
  );
};

export default UpdateEntity;
