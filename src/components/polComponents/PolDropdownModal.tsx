import { Entity } from "@/sdk/contracts/Entity";
import { KeyOfStringOrNumber } from "@/sdk/models/KeyOfStringOrNumber";
import { useState } from "react";
import EntityTableView, { Column } from "./EntityTableViews/EntityTableView";
import PolInput from "./PolInput";
import PolModal from "./PolModal";
import EntityTableWithHeader from "./EntityTableViews/EntityTableWithHeader";
import PolIcon from "../PolIcon";
import { cn } from "@/lib/utils";

interface Props<T> {
  selectedId: string;
  options: T[];
  columns: Column<T>[];
  orderByProperty?: KeyOfStringOrNumber<T> | ((data: T) => any);
  onValueChanged: (value: string) => void;
  label?: string;
  nameGetter: (x: T) => string;
  searchText?: string;
  onSearchTextChanged?: (text: string) => void;
  disableSearchBar?: boolean;
  className?: string;
}

export default function PolDropdownModal<T extends Entity>({
  orderByProperty,
  nameGetter,
  label,
  onValueChanged,
  selectedId,
  options,
  columns,
  searchText,
  disableSearchBar: disableSearchBar,
  onSearchTextChanged,
  className,
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedValue = options?.find((x) => x.id === selectedId);

  return (
    <PolModal
      onOpenChanged={(x) => setIsOpen(x)}
      heading={"Select an option"}
      isOpen={isOpen}
      className="h-[100dvh] min-w-[50dvw] overflow-auto md:h-[75dvh]"
      modalTrigger={
        <PolInput
          className={cn("w-full cursor-pointer", className)}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          label={label}
          value={selectedId && options && nameGetter && selectedValue && nameGetter(selectedValue)}
        ></PolInput>
      }
    >
      <div className="h-fit">
        <EntityTableWithHeader
          disableHeader={disableSearchBar}
          headerClassName="top-0"
          searchText={searchText}
          onSearchTextChanged={onSearchTextChanged}
          pageTitle={label}
          className="w-full"
          onRowClicked={(x) => {
            if (x.id === selectedId) {
              onValueChanged(null);
            } else {
              onValueChanged(x.id);
            }
            setIsOpen(false);
          }}
          orderByProperty={orderByProperty}
          columns={[
            { renderCell: (value) => value.id === selectedId && <PolIcon name="Check" />, label: "" },
            ...columns,
          ]}
          data={options}
        ></EntityTableWithHeader>
      </div>
    </PolModal>
  );
}
