import { cn } from "@/lib/utils";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { UseMutationResult } from "@tanstack/react-query";
import PolText from "./PolText";

interface Props {
  mutation: UseMutationResult<any, Error, any, unknown> | UseMutationResult<any, Error, any, unknown>[];
  className?: string;
  customErrorMessage?: string;
}

export default function PolMutationErrorPresenter({ mutation, className, customErrorMessage }: Props) {
  if (Array.isArray(mutation)) {
    const errorMessage = mutation
      .filter((x) => isUsable(x.error))
      .map((x) => x.error.message)
      .join(", ");
    if (isNullOrWhitespace(errorMessage) === false) {
      return (
        <PolText type="muted" className={cn("m-2 text-red-700", className)}>
          {errorMessage}
        </PolText>
      );
    }
  } else if (isUsable(mutation.error?.message)) {
    return (
      <PolText type="muted" className={cn("m-2 text-red-700", className)}>
        {mutation.error.message}
      </PolText>
    );
  } else if (customErrorMessage) {
    return (
      <PolText type="muted" className={cn("m-2 text-red-700", className)}>
        {customErrorMessage}
      </PolText>
    );
  }

  return <div className={className}></div>;
}
