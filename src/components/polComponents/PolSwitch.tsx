import { cn } from "@/lib/utils";
import { Switch } from "@nextui-org/react";
import { ReactNode } from "react";

interface PolSwitchProps {
  children: ReactNode;
  value: boolean;
  onValueChanged: (value: boolean) => any;
  className?: string;
}

export default function PolSwitch({ children, value, onValueChanged, className }: PolSwitchProps) {
  return (
    <div className={className}>
      <Switch
        isSelected={value}
        onValueChange={onValueChanged}
        classNames={{
          wrapper: "p-0 h-4 overflow-visible",
          thumb: cn(
            "w-6 h-6 border-2 shadow-lg",
            "group-data-[hover=true]:border-primary",
            //selected
            "group-data-[selected=true]:ml-6",
            // pressed
            "group-data-[pressed=true]:w-7",
            "group-data-[selected]:group-data-[pressed]:ml-4",
          ),
        }}
      >
        {children}
      </Switch>
    </div>
  );
}
