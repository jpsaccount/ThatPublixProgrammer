import { PolButton } from "@/components/polComponents/PolButton";
import useMultistepForm from "@/customHooks/useMultistepForm";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { Box, Step, StepLabel, Stepper } from "@mui/material";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import PolLoadingSection from "./polComponents/PolLoadingSection";
import PolText from "./polComponents/PolText";

interface MultiFormProps {
  views: [string, ReactNode][];
  className?: string;
  validateStep?: (stepIndex: number) => Promise<string | null> | string | null;
  onNavigateStep?: (stepIndex: number) => Promise<any> | any;
  onSuccess: () => Promise<any> | any;
  canGoBack?: boolean;
  canGoForward?: boolean;
  startingStepIndex?: number;
}

export default function MultiForm({
  views,
  className,
  validateStep,
  onSuccess,
  canGoBack = true,
  canGoForward = true,
  startingStepIndex,
  onNavigateStep,
}: MultiFormProps) {
  const viewComponents = useMemo(() => Array.from(views.values()), [views]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { currentStepIndex, currentStep, steps, goBack, goNext, goTo } = useMultistepForm(
    viewComponents.map((x) => x[1]),
  );

  useEffect(() => {
    if (startingStepIndex) {
      goTo(startingStepIndex);
      onNavigateStep && onNavigateStep(startingStepIndex);
    }
  }, [startingStepIndex]);

  async function onSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setIsLoading(true);
    const nextStep = currentStepIndex + 1;
    const response = validateStep && validateStep(currentStepIndex);
    let errorMessage = null;
    if (response instanceof Promise) {
      errorMessage = await response;
    } else {
      errorMessage = response ?? null;
    }
    if (isNullOrWhitespace(errorMessage) && nextStep !== steps.length) {
      goTo(nextStep);
      await (onNavigateStep && onNavigateStep(nextStep));
    } else {
      setErrorMessage(errorMessage);
    }
    setIsLoading(false);
  }

  async function tryOnSuccess() {
    if (currentStepIndex + 1 === steps.length) {
      await (onSuccess ? onSuccess() : undefined);
    }
  }

  const onBackClicked = () => {
    setErrorMessage("");
    goBack();
  };

  const isStepFailed = (step: number) => {
    return false;
  };
  return (
    <div className={className}>
      <Box
        sx={{
          width: "70%",
          minWidth: "min(450px, 100dvw)",
          textAlign: "center",
          margin: "auto",
          padding: "25px",
          height: "10%",
        }}
      >
        <Stepper activeStep={currentStepIndex}>
          {views
            .map((x) => x[0])
            .map((label) => {
              // const labelProps: {
              //     optional?: React.ReactNode;
              //     error?: boolean;
              // } = {};
              // if (isStepFailed(index)) {
              //     labelProps.optional = (
              //         <Typography variant="caption" color="error">
              //             Alert message
              //         </Typography>
              //     );
              //     labelProps.error = true;

              return (
                // }
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
        </Stepper>
      </Box>
      <form onSubmit={onSubmit} className="grid h-[90%] grid-rows-[auto_1fr_auto] p-5">
        <PolText type="bold" className="text-center text-red-500">
          {errorMessage}
        </PolText>
        <PolLoadingSection isLoading={isLoading}>
          <div>{currentStep}</div>
        </PolLoadingSection>
        <div className="mt-auto grid grid-flow-col grid-cols-[auto_1fr_auto] pt-5">
          {canGoBack && currentStepIndex !== 0 ? (
            <PolButton type="button" data-testid="multiFormBackButton" onClick={onBackClicked}>
              Back
            </PolButton>
          ) : (
            <div></div>
          )}
          <div></div>
          {canGoForward && (
            <PolButton type="submit" data-testid="multiFormNextButton" onClick={tryOnSuccess}>
              {currentStepIndex !== steps.length - 1 ? "Next" : "Finish"}
            </PolButton>
          )}
        </div>
      </form>
    </div>
  );
}
