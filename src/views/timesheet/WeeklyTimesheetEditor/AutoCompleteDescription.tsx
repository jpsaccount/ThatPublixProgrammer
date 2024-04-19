import { PolDropdown } from "@/components/polComponents/PolDropdown";
import { useDbSearch } from "@/customHooks/sdkHooks/useDbSearch";
import useQueryTemplate from "@/customHooks/sdkHooks/useQueryTemplate";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { useEffect } from "react";

interface props {
  description: string;
  updateTimeBlock: (timeUpdates: Partial<TimeActivity>) => Promise<void>;
  currentUserId: string;
}
export default function AutoCompleteDescription({ currentUserId, description, updateTimeBlock }) {
  const { searchText, setSearchText, query } = useQueryTemplate(
    `WHERE c.Description CONTAINS "{0}" AND c.UserId = "${currentUserId}" LIMIT 15`,
  );

  useEffect(() => {
    setSearchText(description ?? "");
  }, [description]);
  const descriptionSearchRequest = useDbSearch(TimeActivity, query, {
    enabled: isNullOrWhitespace(searchText) === false,
  });

  return (
    <PolDropdown
      allowCustom={true}
      nameGetter={(x) => x}
      options={descriptionSearchRequest.data ?? []}
      className=" m-2 min-w-[20rem]"
      placeHolder="Description"
      data-testid="description-input"
      text={searchText}
      onTextChanged={(value) => {
        setSearchText(value);
      }}
      onValueChanged={(e) => setSearchText(e ?? "")}
      onBlur={(e) =>
        e.target.value !== description &&
        updateTimeBlock({
          Description: e.target.value ?? "",
        })
      }
    />
  );
}
