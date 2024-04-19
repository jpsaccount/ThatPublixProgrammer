import { Entity } from "@/sdk/contracts/Entity";
import React, { ReactNode } from "react";
import { X } from "lucide-react";
import { a } from "vitest/dist/suite-ghspeorC.js";
import { Label } from "./ui/label";
import PolModal from "./polComponents/PolModal";
import { Badge } from "./ui/badge";

interface Props<T extends Entity> {
  options: T[];
  onValueChanged: (value: string[]) => void;
  value: string[];
  nameGetter: (x: T) => string;
  label?: string;
  trigger: ReactNode;
}

export default function PolMultiSelectModal<T extends Entity>({
  label,
  options,
  onValueChanged,
  value,
  nameGetter,
  trigger,
}: Props<T>) {
  const handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, x: T) => {
    if (e.currentTarget.classList.contains("bg-gray-300")) {
      onValueChanged(value.filter((y) => y !== x.id));
    } else {
      onValueChanged([...value, x.id]);
    }
    e.currentTarget.classList.toggle("bg-gray-300");
  };

  const handleRemove = (e: React.MouseEvent, x: string) => {
    e.nativeEvent.stopImmediatePropagation();
    onValueChanged(value.filter((y) => y !== x));
  };

  return (
    <>
      <Label>
        {label}
        <PolModal modalTrigger={<span>{trigger}</span>}>
          <div className="flex max-h-96 flex-col overflow-auto">
            {options.map((x) => (
              <span
                key={x.id}
                onClick={(e) => handleClick(e, x)}
                className={`w-full rounded-md px-2 py-1 hover:cursor-pointer hover:bg-gray-200 active:bg-gray-300 ${value.includes(x.id) && "bg-gray-300"}`}
              >
                {nameGetter(x)}
              </span>
            ))}
          </div>
        </PolModal>
      </Label>
      <span className="mt-2 flex w-64 flex-wrap justify-center gap-1">
        {value.map((x) => (
          <Badge>
            <span className="mr-1 w-fit hover:cursor-pointer" onClick={(e) => handleRemove(e, x)}>
              <X size={15}></X>
            </span>
            {nameGetter(options.find((option) => option.id === x) as T)}
          </Badge>
        ))}
      </span>
    </>
  );
}
