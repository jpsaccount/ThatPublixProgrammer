import { cn } from "@/lib/utils";
import { Fade } from "@chakra-ui/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import PolSpinner from "../polComponents/PolSpinner";
import { Button } from "../ui/button";
import { isUsable } from "@/utilities/usabilityUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@tanstack/react-router";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  isLoading?: boolean;
  tooltip?: string;
  "data-testid"?: string;
  href?: string;
}

export function PolButton({
  onClick,
  children,
  className = "",
  variant = "default",
  tooltip,
  isLoading = false,
  href,
  ...props
}: Props) {
  const [isHandlingClick, setIsHandlingClick] = useState(false);

  useLayoutEffect(() => {
    setIsHandlingClick(isLoading);
  }, [isLoading]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const action: any = onClick && onClick(event);
      if (action instanceof Promise) {
        setIsHandlingClick(true);

        action.finally(() => {
          setIsHandlingClick(false);
        });
      }
    },
    [onClick, setIsHandlingClick],
  );

  let button = (
    <Button
      variant={variant}
      onClick={handleClick}
      disabled={isHandlingClick}
      className={cn("hover:scale-10 z-[1] w-auto transition active:scale-95", className)}
      data-testid={props["data-testid"]}
      {...props}
    >
      <div className={`overlayChildren center-Items w-full`}>
        {isHandlingClick && (
          <Fade in={isHandlingClick} className="grid">
            <PolSpinner
              IsLoading={true}
              variant={variant === "default" ? "secondary" : "primary"}
              size={"25px"}
              className={cn("m-auto", variant != "ghost" ? "white-spinner" : "")}
            />
          </Fade>
        )}

        <Fade in={isHandlingClick === false}>{children}</Fade>
      </div>
    </Button>
  );

  if (isUsable(href)) {
    button = (
      <Link className={className} to={href}>
        {button}
      </Link>
    );
  }

  if (isUsable(tooltip)) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>

          <TooltipContent className="backdrop-blur-lg">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else {
    return button;
  }
}
