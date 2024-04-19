import { PolDropdown } from "@/components/polComponents/PolDropdown";
import { withComponentMemo } from "@/customHooks/withComponentMemo";
import { Entity } from "@sdk/./contracts/Entity";
import { deepEquals } from "@sdk/utils/equalityUtils";
import { QueryObserverResult } from "@tanstack/react-query";
import { HtmlHTMLAttributes, ReactNode } from "react";

interface Props<T> extends HtmlHTMLAttributes<any> {
  isEnabled?: boolean;
  className?: string;
  containerClassName?: string;
  label?: string;
  options?: T[];
  value?: T;
  selectedId?: string;
  onValueChanged: (newVal: T) => void;
  placeHolder?: string;
  nameGetter: (entity: T) => string;
  itemTemplate?: (value: T) => ReactNode;
  required?: boolean;
  sortBy?: keyof T | "nameGetter";
  sortDirection?: "asc" | "desc";
  isSearchable?: boolean;
  text?: string;
  onTextChanged?: (value: string) => void | Promise<void>;
  allowClear?: boolean;
  optionsRequest?: QueryObserverResult<T[], Error>;
  isLoadingOptions?: boolean;
  noOptionsDropdownView?: ReactNode;
  "data-testid"?: string;
  disablePortal?: boolean;
}

function shouldNotRender<T>(oldProps: Readonly<Props<T>>, newProps: Readonly<Props<T>>) {
  return deepEquals(oldProps, newProps);
}

function NotMemoPolEntityDropdown<T extends Entity>({
  isEnabled = true,
  label,
  containerClassName,
  className,
  optionsRequest,
  options = optionsRequest?.data,
  isLoadingOptions = optionsRequest?.isLoading,
  onValueChanged,
  placeHolder,
  selectedId,
  value = options?.find((x) => x.id == selectedId) ?? null,
  nameGetter,
  itemTemplate,
  required,
  sortBy,
  sortDirection = "asc",
  isSearchable = true,
  noOptionsDropdownView,
  ...props
}: Props<T>) {
  return (
    <PolDropdown
      isLoadingOptions={isLoadingOptions}
      isSearchable={isSearchable}
      containerClassName={containerClassName}
      label={label}
      className={className}
      itemTemplate={itemTemplate}
      options={options}
      nameGetter={nameGetter}
      value={value}
      placeHolder={placeHolder}
      onValueChanged={(value) => onValueChanged(value)}
      required={required}
      sortBy={sortBy}
      sortDirection={sortDirection}
      noOptionsDropdownView={noOptionsDropdownView}
      allowCustom={false}
      {...props}
    />
  );
}

const PolEntityDropdown = withComponentMemo(NotMemoPolEntityDropdown, shouldNotRender);
export default PolEntityDropdown;
