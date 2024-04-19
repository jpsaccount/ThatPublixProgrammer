import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import PolText from "./polComponents/PolText";
import { ScrollArea } from "./ui/scroll-area";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";

interface TooltipContentProps {
  initialValue: any;
  value: any;
  propertyName: string;
}

const CustomTooltipContent = ({ initialValue, value, propertyName }: TooltipContentProps) => {
  let oldValue;

  if (isUsable(initialValue[propertyName])) {
    oldValue = "null";
  } else {
    oldValue = initialValue[propertyName];
  }

  const newValue = value[propertyName];

  return (
    <div className="flex flex-col gap-2">
      <PolText>{`${propertyName}: from ${oldValue} to ${newValue}`}</PolText>
    </div>
  );
};

interface Props {
  propertiesChanged: Set<string>;
  value: any;
  initialValue: any;
}

const ChangeTrackerTooltip = ({ propertiesChanged, value, initialValue }: Props) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <PolText>{`${propertiesChanged.size} changes`}</PolText>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-2">
            <PolText className="border-b">Changes:</PolText>
            <ScrollArea className=" max-h-28 flex flex-col">
              {Array.from(propertiesChanged).map((prop, index) => (
                <CustomTooltipContent key={index} propertyName={prop} value={value} initialValue={initialValue} />
              ))}
            </ScrollArea>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ChangeTrackerTooltip;
