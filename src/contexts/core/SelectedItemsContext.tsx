import React, { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import { Entity } from "@/sdk/contracts/Entity";

export interface SelectedItemsContextType {
  Items: any[];
  SelectedItems: any[];
  AddItem: (item: any) => void;
  RemoveItem: (item: any) => void;
  SetSelectedItems: (items: any[]) => void;
  UpdateItem: (item: any, updatedProperties?: Partial<any>) => void;
}

// Define the default context value
const defaultContextValue: SelectedItemsContextType = {
  Items: [],
  SelectedItems: [],
  AddItem: () => {}, // Empty function as placeholder
  RemoveItem: () => {}, // Empty function as placeholder
  SetSelectedItems: () => {}, // Corrected function as placeholder
  UpdateItem: () => {}, // Corrected function as placeholder
};

interface Props {
  children: ReactNode;
  Items: any[];
  initialSelectedItems?: any[];
}

export function createSelectedItemsContext() {
  const context = createContext(defaultContextValue);

  const Provider = ({ children, Items, initialSelectedItems = [] }: Props) => {
    const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
    const [items, setItems] = useState([]);

    useEffect(() => {
      setItems(Items);
    }, [Items]);

    useEffect(() => {
      setSelectedItems((previousItems) =>
        previousItems.map((x) => Items.find((i) => i.id == x.id)).filter((x) => x != null),
      );
    }, [Items]);

    function addSelectedItem(item) {
      setSelectedItems([...selectedItems, item]);
    }

    function removeSelectedItem(item) {
      setSelectedItems(selectedItems.filter((x) => x !== item));
    }

    function updateItem<T extends Entity>(item: T, newProperties?: Partial<T>) {
      if (isUsable(item)) {
        const newValue = { ...item, ...(newProperties ?? {}) };
        setItems(items.map((x) => (x.id == item.id ? newValue : x)));
        setSelectedItems(selectedItems.map((x) => (x.id == item.id ? newValue : x)));
      }
    }

    return (
      <context.Provider
        value={{
          Items: items,
          SelectedItems: selectedItems,
          AddItem: addSelectedItem,
          RemoveItem: removeSelectedItem,
          SetSelectedItems: setSelectedItems,
          UpdateItem: updateItem,
        }}
      >
        {children}
      </context.Provider>
    );
  };

  return { context, Provider };
}
