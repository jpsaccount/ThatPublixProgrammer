import { useState, useEffect, useMemo } from "react";
import { useSearchParamState } from "../useSearchParamState";
import { getQueryValue } from "./getQueryValue";
import { isUsable } from "@/sdk/utils/usabilityUtils";

export default function useFilterQueryTemplate(query: string, values: Map<string, any[]>) {
  return useMemo(() => {
    const keys = Array.from(values.keys()).filter((x) => isUsable(x));
    if (query.includes("{Filter}")) {
      if (keys.length === 0) {
        return query.replace("{Filter}", "");
      }
      return query.replace(
        "{Filter}",
        " AND " +
          keys
            .map((key) => {
              const value = values.get(key);
              if (typeof value[0] === "string") {
                return `c.${key} IN ["${value.join(`","`)}"]`;
              } else {
                return `c.${key} IN [${value.join(",")}]`;
              }
            })
            .join(" AND "),
      );
    } else {
      throw new Error(`Query must contain {Filter}`);
    }
  }, [query, values]);
}
