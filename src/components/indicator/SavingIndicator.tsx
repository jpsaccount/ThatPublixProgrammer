import React, { useEffect, useState } from "react";
import PolIcon from "../PolIcon";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { UseMutationResult } from "@tanstack/react-query";

interface Props {
  isSaving?: boolean;
  saveMutation?: UseMutationResult<any, Error, any, unknown>;
  className?: string;
  collapse?: boolean;
}

export default function SavingIndicator({
  saveMutation,
  isSaving = saveMutation?.isPending || saveMutation?.isError,
  className,
  collapse,
}: Props) {
  const [hiddenClass, setHiddenClass] = useState("opacity-0");

  useEffect(() => {
    if (isSaving) setHiddenClass("opacity-100");
    const timer = setTimeout(() => {
      setHiddenClass("opacity-0");
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [isSaving]);

  return (
    (collapse === false || hiddenClass === "opacity-100") && (
      <div className={cn("transition-all", hiddenClass, className)}>
        <AnimatePresence mode="wait">
          {saveMutation?.isPending ?? isSaving ? (
            <motion.div key={1} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
              <PolIcon className={cn("animate-pulse duration-1000")} name="Save"></PolIcon>
            </motion.div>
          ) : (
            <motion.div
              key={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <PolIcon
                data-testid="savedIcon"
                className={cn("duration-1000")}
                name={saveMutation?.isError ? "Error" : "CheckCircle"}
              ></PolIcon>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  );
}
