import { useEffect, useState } from "react";
import { useSearchParamState } from "../useSearchParamState";
import { getQueryValue } from "./getQueryValue";

export default function useSearchParamQueryTemplate(
  template: string,
  defaultValue: string = "",
  useSearchParams: boolean = true,
) {
  const [searchText, setSearchText] = useSearchParams ? useSearchParamState("q", "") : useState("");
  const [queryText, setQueryText] = useState(getQueryValue(searchText, template, defaultValue));
  const [query, setQuery] = useState(queryText);

  useEffect(() => {
    setQueryText(getQueryValue(searchText, template, defaultValue));
  }, [searchText, template, defaultValue]);

  useEffect(() => {
    const timeOutId = setTimeout(() => setQuery(queryText), 500);
    return () => clearTimeout(timeOutId);
  }, [queryText]);

  return { query, searchText, setSearchText };
}
