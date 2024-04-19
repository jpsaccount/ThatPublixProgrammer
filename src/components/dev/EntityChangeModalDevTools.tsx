import { Expense } from "@/sdk/entities/billing/Expense";
import { isDevEnvironment } from "@/sdk/utils/devUtils";
import React from "react";
import EntityChangeViewer from "../EntityChangeViewer";
import { PolButton } from "../polComponents/PolButton";
import PolModal from "../polComponents/PolModal";
import { Entity } from "@/sdk/contracts/Entity";
interface Props<T> {
  value: T;
  type: { new (...args: any[]): T };
}
export default function EntityChangeModalDevTools<T extends Entity>({ value, type }: Props<T>) {
  return (
    isDevEnvironment() &&
    false && (
      <PolModal
        modalTrigger={
          <PolButton className="fixed w-fit" variant="ghost">
            EntityChanges
          </PolButton>
        }
      >
        <EntityChangeViewer type={type} value={value} />
      </PolModal>
    )
  );
}
