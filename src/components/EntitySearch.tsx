import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import React, { ReactNode, useState } from "react";
import PolInput from "./polComponents/PolInput";
import { Search } from "lucide-react";
import { Entity } from "@/sdk/contracts/Entity";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { PolRequestPresenter } from "./polComponents/PolRequestPresenter";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface Props<T extends Entity> {
  entityType: new (...args: any[]) => T;
  matchProperties: Array<keyof T>;
  itemTemplate: (val: T) => ReactNode;
  defaultSearch: string;
}

export default function EntitySearch<T extends Entity>({
  defaultSearch,
  entityType,
  matchProperties,
  itemTemplate,
}: Props<T>) {
  const [searched, setSearched] = useState(false);
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(
    `WHERE ${matchProperties.map((prop) => `c.${prop.toString()} CONTAINS "{0}"`)} ${defaultSearch && `AND ${defaultSearch}`}`,
    "",
    false,
  );
  const entityRequest = useDbQuery(entityType, query, { enabled: searchText !== "" });
  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      console.log("is showing");
      setSearched(true);
    }
  };
  return (
    <>
      <Popover
        open={searched}
        onOpenChange={(x) => {
          if (!x) {
            setSearched(x);
          }
        }}
      >
        <PopoverTrigger>
          <PolInput
            onKeyDown={handleKeyDown}
            onValueChanged={setSearchText}
            value={searchText}
            placeholder="Search"
            className=" pl-6"
            overlayElement={<Search stroke="gray" size={15} className="my-auto ml-2"></Search>}
          ></PolInput>
        </PopoverTrigger>
        <PopoverContent className="bg-white">
          {searchText !== "" && (
            <PolRequestPresenter
              request={entityRequest}
              onSuccess={() => (
                <>
                  {entityRequest.data.length > 0 ? (
                    <div className="flex flex-col">{entityRequest.data.map((entity) => itemTemplate(entity))}</div>
                  ) : (
                    <p>No results.</p>
                  )}
                </>
              )}
            ></PolRequestPresenter>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
