import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolText from "@/components/polComponents/PolText";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React from "react";

interface Props {
  columns: any[];
  availableColumns: any[];
  onChange: (val: any[]) => void;
}

export default function ColumnSelect({ columns, availableColumns, onChange }: Props) {
  const toggleColumn = (column: any) => {
    if (availableColumns.includes(column)) {
      onChange([...availableColumns.filter((availableColumn) => availableColumn !== column)]);
    } else {
      onChange([...availableColumns, column]);
    }
  };
  return (
    <Popover>
      <PopoverTrigger>Columns</PopoverTrigger>
      <PopoverContent className="w-fit space-y-1 bg-white">
        {columns.map((column) => (
          <span className="flex gap-1">
            <PolCheckbox onClick={() => toggleColumn(column)} value={availableColumns.includes(column)}></PolCheckbox>
            <PolText type="small">{column.header}</PolText>
          </span>
        ))}
      </PopoverContent>
    </Popover>
  );
}
