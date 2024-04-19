import { ReactNode, useState } from "react";

export default function useMultistepForm(steps: ReactNode[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function goNext() {
    setCurrentStepIndex((x) => {
      if (x >= steps.length - 1) return x;
      return x + 1;
    });
  }

  function goBack() {
    setCurrentStepIndex((x) => {
      if (x === 0) return x;
      return x - 1;
    });
  }

  function goTo(index: number) {
    setCurrentStepIndex(index);
  }

  return {
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    steps,
    goTo,
    goNext,
    goBack,
  };
}
