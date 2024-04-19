import { Textarea } from "@/components/ui/textarea";
import { isUsable } from "@/utilities/usabilityUtils";
import moment, { Moment } from "moment";
import React, { HTMLInputTypeAttribute, ReactElement, useContext, useEffect, useMemo, useState } from "react";
import { LabelSection } from "../LabelSection/LabelSection";
import { Input } from "../ui/input";

interface Props<T extends string | string[] | number | Moment | undefined> extends React.HTMLAttributes<any> {
  isDisabled?: boolean;
  label?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute | "currency" | undefined;
  isMultiline?: boolean;
  overlayElement?: ReactElement;
  className?: string;
  containerClassName?: string;
  onValueChanged?: (value: T) => void;
  value?: T;
  valueChangeOn?: "change" | "blur" | number;
  "data-testid"?: string;
  isNullable?: boolean;
}

function PolInput<T extends string | string[] | number | Moment | undefined>(
  passedProps: Props<T>,
  ref: React.Ref<any>,
) {
  let {
    isDisabled = false,
    label,
    placeholder,
    type = "text",
    value,
    overlayElement: sideElement,
    className,
    containerClassName,
    isMultiline = false,
    onValueChanged,
    valueChangeOn,
    isNullable = false,
    onClick,
    ...props
  } = passedProps;

  if (isUsable(valueChangeOn) === false) {
    valueChangeOn = "change";
  }

  const overlayElement = useMemo(() => {
    return sideElement;
  }, [sideElement]);

  let input: any;

  if (type === "currency") {
    type = "tel";
  }

  const inputValue = useMemo(() => {
    let inputValue = value as any;
    if (moment.isMoment(value)) {
      inputValue = value.format("YYYY-MM-DD");
    }
    return inputValue;
  }, [value]);

  const [currentValue, setCurrentValue] = useState(null);
  useEffect(() => {
    setCurrentValue(inputValue);
  }, [inputValue]);

  const [timer, setTimer] = useState(null);

  function onChange(newValue: any) {
    setCurrentValue(newValue);
    if (valueChangeOn === "change" || (typeof valueChangeOn === "number" && valueChangeOn < 0)) {
      triggerOnValueChanged(newValue);
    } else if (typeof valueChangeOn === "number") {
      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          triggerOnValueChanged(newValue);
        }, valueChangeOn),
      );
    }
  }

  function onBlur(newValue: any) {
    if ((valueChangeOn === "blur" || typeof valueChangeOn === "number") && newValue != value) {
      triggerOnValueChanged(newValue);
    }
  }

  function triggerOnValueChanged(newValue: any) {
    clearTimeout(timer);

    let parsedValue = null;

    if ((newValue === null && type === "date") || moment.isMoment(value)) {
      parsedValue = moment(newValue).utc(true) as T;
    } else {
      if (type === "number") {
        if (newValue === "") {
          parsedValue = isNullable ? null : (0 as T);
        } else {
          parsedValue = parseFloat(newValue) as T;
        }
      } else {
        parsedValue = newValue as T;
      }
    }

    onValueChanged && onValueChanged(parsedValue);
  }

  if (isMultiline) {
    input = (
      <Textarea
        data-testid={props["data-testid"]}
        ref={ref}
        disabled={isDisabled}
        name={label}
        className={` input-focus-visible bg-[rgba(0,0,0,0.02) border border-solid border-gray-200 ${className}`}
        placeholder={placeholder}
        {...props}
        value={currentValue}
        onChange={(e) => {
          onChange(e.target.value);
          props.onChange && props.onChange(e);
        }}
        onBlur={(e) => {
          onBlur(e.target.value);
          props.onBlur && props.onBlur(e);
        }}
      />
    );
  } else {
    input = (
      <Input
        onClick={onClick}
        data-testid={props["data-testid"]}
        ref={ref}
        disabled={isDisabled}
        name={label}
        className={` input-focus-visible border border-solid border-gray-200 bg-[rgba(0,0,0,0.02)] ${className}`}
        placeholder={placeholder}
        type={type}
        {...(type === "number" ? { patter: "[0-9]*" } : {})}
        {...props}
        value={currentValue}
        onChange={(e) => {
          onChange(e.target.value);
          props.onChange && props.onChange(e);
        }}
        onBlur={(e) => {
          onBlur(e.target.value);
          props.onBlur && props.onBlur(e);
        }}
      />
    );
  }

  input = sideElement ? (
    <div className="stackGrid h-[fit-content]">
      {input}
      {overlayElement}
    </div>
  ) : (
    input
  );

  if (isUsable(label)) {
    return (
      <>
        <LabelSection label={label} className={containerClassName}>
          {input}
        </LabelSection>
      </>
    );
  } else {
    return input;
  }
}

export default React.forwardRef<HTMLInputElement | HTMLTextAreaElement, Props<any>>(PolInput);
