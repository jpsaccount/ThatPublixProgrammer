import { ReactNode } from "react";
import "./LabelSection.module.css";
import PolText from "../polComponents/PolText";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  children: ReactNode;
  position?: "Top" | "Bottom" | "Right" | "Left";
  className?: string;
}

export function LabelSection({ label: text, children, position = "Top", className, ...props }: Props) {
  const calculatedClassname = () => {
    return cn(position === "Left" || position === "Right" ? " grid-flow-row" : "", className);
  };

  const label = (
    <PolText type="muted" data-testid={props["data-testid"]} className="input-label pb-0.5 font-medium text-text-500">
      {text}
    </PolText>
  );

  return (
    <section data-testid={props["data-testid"] + "Section"} className={calculatedClassname()}>
      {position === "Top" || position === "Left" ? label : ""}
      {children}
      {position === "Bottom" || position === "Right" ? label : ""}
    </section>
  );
}
