import useDevice from "@/customHooks/useDevice";
import { cn } from "@/lib/utils";
import { Autocomplete, TextField } from "@mui/material";
import { isUsable } from "@/utilities/usabilityUtils";
import { HtmlHTMLAttributes, ReactNode, useEffect, useState } from "react";
import { LabelSection } from "../LabelSection/LabelSection";
import { isNullOrWhitespace } from "@/utilities/stringUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const styles = {
  control: (provided) => ({
    ...provided,
    borderColor: undefined,
    borderWidth: undefined,
    borderRadius: undefined,
    boxShadow: undefined,
    backgroundColor: "var(--background-50)",
    color: undefined,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: "var(--background-50)",
    color: undefined,
    ":hover": {
      backgroundColor: "var(--secondary-100)",
      color: undefined,
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "var(--background-50)",
    color: undefined,
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: "var(--background-50)",
    color: undefined,
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: undefined,
    fontSize: undefined,
    zIndex: 0,
  }),

  placeholder: (provided: any) => ({
    ...provided,
    className: cn(provided.className, "text-text-100 "),
    fontSize: undefined,
    zIndex: 0,
  }),

  input: (provided: any) => ({
    ...provided,
    color: undefined,
    fontSize: undefined,
  }),
};

interface Props<T> extends HtmlHTMLAttributes<any> {
  label?: string;
  containerClassName?: string;
  options: T[];
  value?: T | null;
  onValueChanged?: (newVal: T) => void;
  nameGetter: (newVal: T) => string;
  placeHolder?: string;
  className?: string;
  required?: boolean;
  itemTemplate?: (value: T) => ReactNode;
  isDisabled?: boolean;
  sortBy?: keyof T | "nameGetter";
  sortDirection?: "asc" | "desc";
  isSearchable?: boolean;
  allowCustom?: boolean;
  allowClear?: boolean;
  text?: string;
  onTextChanged?: (value: string) => void | Promise<void>;
  isLoadingOptions?: boolean;
  noOptionsDropdownView?: ReactNode;
  "data-testid"?: string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  disablePortal?: boolean;
}

export function PolDropdown<T extends {}>({
  options,
  containerClassName,
  nameGetter,
  label,
  onValueChanged,
  placeHolder,
  value,
  className,
  itemTemplate,
  required,
  isDisabled,
  sortBy,
  sortDirection = "asc",
  isSearchable = true,
  allowCustom,
  allowClear = false,
  text,
  onTextChanged,
  isLoadingOptions,
  noOptionsDropdownView,
  isOptionEqualToValue,
  disablePortal = true,
  ...props
}: Props<T>) {
  if (isUsable(itemTemplate) === false) {
    itemTemplate = (x) => nameGetter(x);
  }

  const [sortedOptions, setSortedOptions] = useState([]);

  useEffect(() => {
    if (isUsable(options) === false) {
      options = [];
    }
    let sorted = [...options];
    if (sortBy == null) {
      setSortedOptions(sorted);
      return;
    }
    sorted.sort((a, b) => {
      if (sortBy === "nameGetter") {
        if (nameGetter(a) > nameGetter(b)) {
          return sortDirection === "asc" ? 1 : -1;
        }
        if (nameGetter(a) < nameGetter(b)) {
          return sortDirection === "asc" ? -1 : 1;
        }
      } else {
        if (a[sortBy] > b[sortBy]) {
          return sortDirection === "asc" ? 1 : -1;
        }
        if (a[sortBy] < b[sortBy]) {
          return sortDirection === "asc" ? -1 : 1;
        }
      }
      return 0;
    });
    setSortedOptions(sorted);
  }, [options, sortBy, sortDirection]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const device = useDevice();
  let component = isSearchable ? (
    <Autocomplete
      {...props}
      data-testid={props["data-testid"]}
      noOptionsText={noOptionsDropdownView}
      freeSolo={allowCustom}
      loading={isLoadingOptions}
      openOnFocus={true}
      disablePortal={disablePortal}
      clearOnEscape={true}
      isOptionEqualToValue={isOptionEqualToValue}
      disableClearable={allowClear === false}
      className={cn(className)}
      classes={{
        root: "focus:outline-0",
        inputRoot: "py-[0_!important] px-1 ",
        popper: "!bg-black z-100",
      }}
      disabled={isDisabled}
      options={sortedOptions}
      value={value}
      getOptionLabel={(option) => (nameGetter && nameGetter(option)) ?? ""}
      onChange={(e, value) => onValueChanged && onValueChanged(value)}
      inputValue={text}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            onClick: (e: any) => {
              params.inputProps.onClick && params.inputProps.onClick(e);
            },
          }}
          value={text}
          placeholder={placeHolder}
          onChange={(e) => {
            const text = e.target.value;
            onTextChanged && onTextChanged(text);
            isNullOrWhitespace(text) && onValueChanged && onValueChanged(null);
          }}
        />
      )}
      renderOption={(optionProps, option: T, state) => (
        <li
          {...optionProps}
          data-testid={props["data-testid"] + `-option-${state.index}`}
          className={cn(optionProps.className, "dark:darkgrey light:white")}
        >
          {itemTemplate(option)}
        </li>
      )}
    ></Autocomplete>
  ) : (
    <Select
      data-testid={props["data-testid"]}
      open={open}
      onOpenChange={(e) => (e ? handleOpen() : handleClose())}
      // classes={{ select: "!text-text-900 " }}
      // className={cn("h-10 bg-[rgba(0,0,0,0.02)] text-text-900 ", className)}
      value={(value && nameGetter(value)) ?? ""}
      onValueChange={(e) => onValueChanged && onValueChanged(options.find((x) => nameGetter(x) == e))}
    >
      <SelectTrigger className="bg-[rgba(255,255,255,0.15)]">
        <SelectValue placeholder={placeHolder} />
      </SelectTrigger>
      <SelectContent className="bg-[rgba(255,255,255,0.05)] text-text-900 backdrop-blur ">
        {sortedOptions.map((x, index) =>
          device.isMobile ? (
            <option data-testid={props["data-testid"] + `-option-${index}`} key={nameGetter(x)} value={nameGetter(x)}>
              {nameGetter(x)}
            </option>
          ) : (
            <SelectItem
              className="cursor-pointer rounded hover:bg-[rgba(0,0,0,0.1)]"
              key={nameGetter(x)}
              value={nameGetter(x)}
            >
              {nameGetter(x)}
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  );

  if (isUsable(label)) {
    return (
      <LabelSection
        label={label}
        className={`rounded text-left ${containerClassName}`}
        data-testid={props["data-testid"] + "Label"}
      >
        {component}
      </LabelSection>
    );
  } else {
    return component;
  }
}
