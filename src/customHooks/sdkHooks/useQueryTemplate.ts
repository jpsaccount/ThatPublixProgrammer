import { useEffect, useState } from "react";
import { getQueryValue } from "./getQueryValue";

export default function useQueryTemplate(template: string, defaultValue: string = "") {
  const [searchText, setSearchText] = useState("");
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
