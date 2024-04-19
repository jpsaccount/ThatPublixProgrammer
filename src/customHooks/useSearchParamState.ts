import { useNavigate, useSearch } from "@tanstack/react-router";

export function useSearchParamState(
  searchParamName: string,
  defaultValue: string,
): readonly [searchParamsState: string, setSearchParamsState: (newState: string) => void] {
  const searchParams = useSearch({ strict: false });
  const navigate = useNavigate();

  const acquiredSearchParam = searchParams[searchParamName];
  const searchParamsState = acquiredSearchParam ?? defaultValue;

  const setSearchParamsState = (newState: string) => {
    navigate({ search: (pre) => ({ ...pre, [searchParamName]: newState }) });
  };
  return [searchParamsState, setSearchParamsState];
}
