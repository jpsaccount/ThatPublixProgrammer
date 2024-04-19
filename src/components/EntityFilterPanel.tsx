import OutlinedInput from "@mui/material/OutlinedInput";
import useAfterMountedEffect from "@/customHooks/useAfterMountedEffect";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { SelectChangeEvent, ListItemText } from "@mui/material";
import { ReactNode, useState } from "react";
import PolText from "./polComponents/PolText";
import { Checkbox } from "./ui/checkbox";
import PolIcon from "./PolIcon";
import { Dropdown } from "flowbite-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface Props {
  options: Filter[];
  selectedOptions: Map<string, any[]>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Map<string, string[]>>>;
  className?: string;
}

export class Filter {
  icon?: (hasFilters: boolean) => ReactNode;
  label: string;
  property?: string;
  options: FilterOption[];
}

export class FilterOption {
  label: string;
  value: string;
}

export default function EntityFilterPanel({ options, setSelectedOptions, selectedOptions, className }: Props) {
  function select(propertyName: string, value: any) {
    setSelectedOptions((x) => {
      const oldValues = x.get(propertyName) ?? [];

      if (oldValues.includes(value)) {
        const newValues = oldValues.filter((x) => x != value);
        if (newValues.length > 0) {
          x.set(propertyName, newValues);
        } else {
          x.delete(propertyName);
        }
      } else {
        x.set(propertyName, [...oldValues, value]);
      }
      return new Map(x);
    });
  }

  return (
    <div className="grid w-full grid-flow-col rounded border bg-slate-200/50 p-1 md:mx-2 md:w-fit">
      <PolIcon name="Filter" className="my-auto mr-3" stroke="var(--primary-800)" />
      <div className="flex flex-row flex-wrap">
        {options
          .filter((x) => x.options.length > 0)
          .map((x) => {
            const selectedOptionsInCategories = selectedOptions.get(x.property);
            return (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="mx-2 h-fit rounded px-2 hover:bg-primary-800/10"
                  aria-label="dropdownTrigger"
                >
                  <div className="grid grid-flow-col gap-1">
                    {x.icon && x.icon(isUsable(selectedOptionsInCategories))}
                    <PolText>{x.label}</PolText>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  aria-label="moreOptions"
                  className="max-h-64 overflow-y-auto bg-slate-200/50 backdrop-blur"
                >
                  {x.options.map((o) => (
                    <DropdownMenuCheckboxItem
                      className="cursor-pointer stroke-primary-500 hover:bg-background-100"
                      checked={selectedOptionsInCategories?.includes(o.value)}
                      onCheckedChange={(e) => select(x.property, o.value)}
                    >
                      <PolText className="min-h-6">{o.label}</PolText>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
      </div>
    </div>
  );
}
