import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LabelSection } from "../LabelSection/LabelSection";
import { useMemo, useState } from "react";
import { Moment } from "moment";
import moment from "moment";
import PolIcon from "../PolIcon";
import PolText from "./PolText";
import { toUtcDate } from "@/sdk/utils/dateUtils";

interface Props {
  label?: string;
  value: Moment;
  onValueChanged: (newValue: Moment) => void;
  isDisabled?: boolean;
}
export function PolDatePicker({ label, value, onValueChanged, isDisabled = false, ...props }: Props) {
  const [open, setOpen] = useState(false);

  const valueDate = useMemo(() => toUtcDate(value?.toDate()), [value]);
  return (
    <LabelSection label={label} className="w-full">
      <Popover open={open}>
        <PopoverTrigger className="w-full">
          <Button
            disabled={isDisabled}
            onClick={() => setOpen(true)}
            variant={"outline"}
            className={cn(
              "w-full justify-start bg-[rgba(0,0,0,0.02)] p-0 px-4 text-left font-normal",
              !value && "text-muted-foreground",
            )}
            data-testid={props["data-testid"]}
          >
            <PolIcon name="Calendar" className="mr-2 h-4 w-4" />
            <PolText className="my-auto text-text-950">{value ? value.format("MM-DD-YYYY") : "Pick a date"}</PolText>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          onInteractOutside={() => setOpen(false)}
          className="w-auto bg-[rgba(0,0,0,0.005)] p-0 backdrop-blur-md dark:bg-[rgba(0,0,0,0.05)]"
        >
          <Calendar
            classNames={{ day_selected: "border-primary-500 border bg-primary-50 hover:bg-primary-200" }}
            className="text-text-950"
            defaultMonth={valueDate}
            mode="single"
            selected={valueDate}
            onSelect={(x) => {
              onValueChanged(moment.utc(x));
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </LabelSection>
  );
}
