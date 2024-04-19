import React from "react";
import * as pinInput from "@zag-js/pin-input";
import { useMachine, normalizeProps } from "@zag-js/react";
import PolInput from "@/components/polComponents/PolInput";
import { cn } from "@/lib/utils";
import PolHeading from "@/components/polComponents/PolHeading";
import PolLoadingSection from "@/components/polComponents/PolLoadingSection";

interface Props {
  onSubmit: (code: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string;
  resourceName: string;
}

export default function MultiFactorView({ onSubmit, isLoading, errorMessage, resourceName }: Props) {
  const [state, send] = useMachine(
    pinInput.machine({
      id: "1",
      otp: true,
      blurOnComplete: true,
      onValueComplete(details) {
        onSubmit(details.valueAsString);
      },
    }),
  );

  const api = pinInput.connect(state, send, normalizeProps);

  const className = "w-10 text-center";

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 sm:px-0 lg:py-0">
      <PolHeading size={4} className="my-5">
        We sent a code to {resourceName}
      </PolHeading>
      <PolLoadingSection isLoading={isLoading}>
        <div {...api.rootProps} className="flex flex-row space-x-1">
          <PolInput {...api.getInputProps({ index: 0 })} className={cn(className)} />
          <PolInput {...api.getInputProps({ index: 1 })} className={cn(className)} />
          <PolInput {...api.getInputProps({ index: 2 })} className={cn(className)} />
          <PolInput {...api.getInputProps({ index: 3 })} className={cn(className)} />
          <PolInput {...api.getInputProps({ index: 4 })} className={cn(className)} />
          <PolInput {...api.getInputProps({ index: 5 })} className={cn(className)} />
        </div>
      </PolLoadingSection>
    </div>
  );
}
