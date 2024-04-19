import React, { useState, useEffect } from "react";
import { PolButton } from "./polComponents/PolButton";
import { LinearProgress } from "@mui/material";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  isLoading?: boolean;
  tooltip?: string;
  "data-testid"?: string;
  holdDuration?: number;
}

export default function HoldButton({
  onClick,
  children,
  className = "",
  variant = "default",
  tooltip,
  isLoading = false,
  holdDuration = 1000,
  ...props
}: Props) {
  const [isDown, setIsDown] = useState(false);
  const [progress, setProgress] = useState(0);
  const [event, setEvent] = useState<React.MouseEvent<HTMLButtonElement, MouseEvent> | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDown) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            setTimeout(() => {
              clearInterval(timer);
              onClick && onClick(event);
            }, 500);
            return 100;
          }
          return prevProgress + 100 / (holdDuration / 50);
        });
      }, 50);
    } else {
      clearInterval(timer);
      setProgress(0);
    }
    return () => clearInterval(timer);
  }, [isDown]);

  console.log(progress);

  return (
    <PolButton
      isLoading={isLoading}
      onMouseDown={() => setIsDown(true)}
      onMouseUp={(e) => {
        setEvent(e);
        setIsDown(false);
      }}
      variant={variant}
      className={className}
      data-testid={props["data-testid"]}
      {...props}
    >
      {isDown ? (
        <LinearProgress color="inherit" variant="determinate" value={progress} className="w-20" />
      ) : (
        <>{children}</>
      )}
    </PolButton>
  );
}
