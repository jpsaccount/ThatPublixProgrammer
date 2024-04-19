import PolIcon from "@/components/PolIcon";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { KeyOfStringOrNumber } from "@/sdk/models/KeyOfStringOrNumber";
import { useState } from "react";

interface Props<T> {
  data: T[];
  propertiesToSortBy: (string | KeyOfStringOrNumber<T>)[];
  className?: string;
}

export default function EntityTableFilterPanel<T>({ data, propertiesToSortBy, className }: Props<T>) {
  const [sortedProperties, setSortedProperties] = useState<
    { property: string | KeyOfStringOrNumber<T>; direction: "asc" | "desc" }[]
  >([]);
  const handleSort = (property: string | KeyOfStringOrNumber<T>) => {
    const existingProperty = sortedProperties.find((x) => x.property === property);

    const direction = existingProperty ? (existingProperty.direction === "asc" ? "desc" : "asc") : "asc";

    data.sort((a, b) => {
      if (a[property as keyof T] < b[property as keyof T]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[property as keyof T] > b[property as keyof T]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setSortedProperties((prevState) => {
      if (existingProperty) {
        // Flip the direction if the property is already being sorted
        existingProperty.direction = direction;
        return [...prevState];
      } else {
        // Add the property with a default direction if it's not being sorted yet
        return [...prevState, { property, direction }];
      }
    });
  };
  return (
    <Drawer>
      <DrawerTrigger>
        <PolIcon name="Filter" className={cn("my-auto text-2xl", className)} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Settings</DrawerTitle>
          <DrawerDescription>
            <p className="text-sm text-gray-500">Adjust how the data is displayed to you.</p>
          </DrawerDescription>
        </DrawerHeader>
        <div>
          {propertiesToSortBy.map((x) => (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700" onClick={() => handleSort(x)}>
                {x}
              </label>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
