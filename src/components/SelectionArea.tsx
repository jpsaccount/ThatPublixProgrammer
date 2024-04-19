import SelectionAreaItem from "@/components/SelectionAreaItem";
import { SelectedItemsContextType } from "@/contexts/core/SelectedItemsContext";
import { cn } from "@/lib/utils";
import { Entity } from "@sdk/./contracts/Entity";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import React, { useCallback, useContext, useRef } from "react";

class Props<T> {
  className?: string | undefined;
  Items?: T[] | undefined | null;
  ItemTemplate: (T, boolean) => React.ReactNode;
  OnSelected?: (T) => void;
  OnDeselected?: (T) => void;
  OnScroll?: (arg: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  children?: React.ReactNode;
  ItemTemplateClassName?: string;
  SelectedItemClassName?: string;
  RequestedSelectionType?: SelectionType;
  Context?: React.Context<SelectedItemsContextType>;
  Footer?: React.ReactNode;
}

export function SelectionArea<T extends Entity>({
  className,
  children,
  Context,
  OnScroll,
  ItemTemplate,
  OnSelected,
  OnDeselected,
  ItemTemplateClassName,
  SelectedItemClassName,
  RequestedSelectionType = SelectionType.Single,
  Footer,
}: Props<T>) {
  const { SelectedItems, AddItem, RemoveItem, SetSelectedItems, Items } = useContext(Context);
  const selectedItem = useRef(null);

  const toggleSelectedItem = useCallback(
    (item: T, isAlreadySelected: boolean) => {
      if (isAlreadySelected === false) {
        if (SelectedItems.length > 0 && RequestedSelectionType === SelectionType.Single) {
          SetSelectedItems([item]);
        } else {
          AddItem(item);
        }
        if (isUsable(OnSelected)) OnSelected(item);
      } else {
        RemoveItem(item);

        if (isUsable(OnDeselected)) OnDeselected(item);
      }
    },
    [SelectedItems, AddItem, RemoveItem, SetSelectedItems, OnSelected, OnDeselected, RequestedSelectionType],
  );

  return (
    <div className="grid grid-flow-row">
      <div className={cn(`selection-area-container `, className)}>
        {Items?.map((x) => {
          const selectedItems = SelectedItems.filter((i) => i.id == x.id);
          const isSelected = selectedItems.length > 0;
          const refSetter = SelectedItems.length == 1 ? { containerRef: selectedItem } : {};
          return (
            <SelectionAreaItem
              key={x.id}
              Item={x}
              {...refSetter}
              isSelected={isSelected}
              itemTemplateClassName={ItemTemplateClassName}
              selectedItemClassName={SelectedItemClassName}
              onClick={() => toggleSelectedItem(x, isSelected)}
              reactNode={ItemTemplate(x, isSelected)}
            />
          );
        })}
        {Footer}
      </div>
      {children}
    </div>
  );
}

enum SelectionType {
  Single,
  Multiple,
}
