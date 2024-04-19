import { cn } from "@/lib/utils";
import { Filter } from "./EntityFilterPanel";
import { Chip } from "@nextui-org/react";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useMemo } from "react";

interface Props {
  options: Filter[];
  selectedOptions: Map<string, any[]>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Map<string, string[]>>>;
  className?: string;
}

export default function EntityFilterOptionDisplay({ options, selectedOptions, setSelectedOptions, className }: Props) {
  function deleteFilter(propertyName: string, value: string) {
    setSelectedOptions((x) => {
      const oldValues = x.get(propertyName);
      const newValues = oldValues.filter((x) => x != value);
      x.set(propertyName, newValues);
      if (newValues.length === 0) {
        x.delete(propertyName);
      }

      return new Map(x);
    });
  }

  const keys = useMemo(() => Array.from(selectedOptions.keys()), [selectedOptions]);
  return (
    keys.length > 0 && (
      <div className={cn("flex max-h-28 flex-row flex-wrap gap-1 overflow-y-auto rounded border p-2 px-5", className)}>
        {keys.map((x) => {
          const selectedOptionsInCategories = selectedOptions.get(x);
          return selectedOptionsInCategories?.map((s) => (
            <Chip onClose={() => deleteFilter(x, s)}>
              {options.find((i) => i.property === x)?.options.find((o) => o.value === s)?.label}
            </Chip>
          ));
        })}
      </div>
    )
  );
}
