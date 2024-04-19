import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import useQueryTemplate from "@/customHooks/sdkHooks/useQueryTemplate";
import { Pattern } from "@/sdk/entities/project/equipment/Pattern";
import { useLayoutEffect, useMemo } from "react";
import PolEntityDropdown from "../PolEntityDropdown";
import { PolRequestPresenter } from "../PolRequestPresenter";
import PolSkeleton from "../PolSkeleton";
import PolText from "../PolText";
import PolDropdownModal from "../PolDropdownModal";
import { GoogleAuthProvider } from "firebase/auth";
import { Manufacturer } from "@/sdk/entities/project/equipment/Manufacturer";
import { isUsable } from "@/sdk/utils/usabilityUtils";

interface Props {
  onChange: (patternId: string) => any;
  patternId: string;
  label: string;
  "data-testid"?: string;
  className?: string;
}

export default function PatternDropdown({ onChange, patternId, label, className, ...props }: Props) {
  const { searchText, setSearchText, query } = useQueryTemplate(
    `WHERE c.Name CONTAINS "{0}" OR c.Model CONTAINS "{0}" OR c.id = "${patternId}" OFFSET 0 LIMIT 10`,
    "OFFSET 0 LIMIT 0",
  );

  const pattern1Request = useDbQueryFirst(Pattern, `WHERE c.id = "${patternId}'}"`);

  const pattern = pattern1Request.data;

  const goboRequest = useDbQuery(Pattern, query);
  const manufacturerRequest = useDbQuery(
    Manufacturer,
    `WHERE c.id IN ["${goboRequest.data?.map((x) => x.ManufacturerId).join('","')}"]`,
    { enabled: isUsable(goboRequest.data) },
  );

  const options = useMemo(
    () =>
      pattern ? [pattern, ...(goboRequest.data?.filter((x) => x.id !== patternId) ?? [])] : goboRequest.data ?? [],
    [pattern, goboRequest],
  );

  return (
    <PolDropdownModal<Pattern>
      className={className}
      label={label}
      data-testid={props["data-testid"]}
      options={options}
      searchText={searchText}
      selectedId={patternId}
      onSearchTextChanged={setSearchText}
      onValueChanged={(patternId) => {
        onChange && onChange(patternId);
      }}
      columns={[
        {
          label: "Manufacturer",
          renderCell: (x) => (
            <PolText>{manufacturerRequest.data?.find((i) => i.id === x.ManufacturerId)?.Name}</PolText>
          ),
        },
        { id: "Name" },
        { id: "Model" },
        { id: "Description" },
      ]}
      nameGetter={(x) => x.Name}
    ></PolDropdownModal>
  );
}
